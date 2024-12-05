import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '~/utils/db.server';
import type { User } from '~/types/user';

interface UserModel {
  _id: ObjectId;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
}

function mapUserToResponse(user: UserModel): User {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    picture: user.picture,
    createdAt: user.createdAt,
  };
}

export async function authenticateWithGoogle(code: string): Promise<{ user: User; token: string }> {
  console.log("Authenticating with Google...");

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Google OAuth credentials not configured");
    throw new Error('Google OAuth credentials are required');
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.APP_URL}/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to exchange code for tokens:", await tokenResponse.text());
      throw new Error('Failed to exchange code for tokens');
    }

    const { access_token } = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error("Failed to get user info from Google:", await userResponse.text());
      throw new Error('Failed to get user info from Google');
    }

    const { email, name, picture } = await userResponse.json();

    // Find or create user in our database
    const user = await findOrCreateUser(email, name, picture);

    // Create auth token
    const token = await createAuthToken(user);

    console.log("Google authentication successful for user:", user.id);
    return { user, token };
  } catch (error) {
    console.error("Error during Google authentication:", error);
    throw error;
  }
}

export async function findOrCreateUser(email: string, name: string, picture?: string): Promise<User> {
  console.log("Finding or creating user:", { email, name });
  
  try {
    const db = await getDb();
    const collection = db.db().collection<UserModel>('users');

    // Try to find existing user
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      console.log("Found existing user:", existingUser._id.toString());
      return mapUserToResponse(existingUser);
    }

    // Create new user
    const newUser: Omit<UserModel, '_id'> = {
      email,
      name,
      picture,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newUser as UserModel);
    console.log("Created new user:", result.insertedId.toString());

    return {
      id: result.insertedId.toString(),
      email,
      name,
      picture,
      createdAt: newUser.createdAt,
    };
  } catch (error) {
    console.error("Error finding/creating user:", error);
    throw error;
  }
}

export async function createAuthToken(user: User): Promise<string> {
  console.log("Creating auth token for user:", user.id);
  
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    throw new Error('JWT_SECRET is required');
  }

  try {
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log("Auth token created successfully");
    return token;
  } catch (error) {
    console.error("Error creating auth token:", error);
    throw error;
  }
}

export async function verifyToken(token: string): Promise<User | null> {
  console.log("Verifying auth token");
  
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined");
    throw new Error('JWT_SECRET is required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    console.log("Token decoded successfully for user:", decoded.userId);

    const db = await getDb();
    const user = await db
      .db()
      .collection<UserModel>('users')
      .findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      console.log("No user found for decoded token");
      return null;
    }

    console.log("User found and verified:", user._id.toString());
    return mapUserToResponse(user);
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function getUser(id: string): Promise<User | null> {
  console.log("Getting user by ID:", id);
  
  if (!ObjectId.isValid(id)) {
    console.error("Invalid user ID format:", id);
    return null;
  }

  try {
    const db = await getDb();
    const user = await db
      .db()
      .collection<UserModel>('users')
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      console.log("User not found");
      return null;
    }

    console.log("User found:", user._id.toString());
    return mapUserToResponse(user);
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

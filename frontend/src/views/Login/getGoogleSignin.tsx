import axios from "axios";

export async function getGoogleUser(accessToken: string) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data; // מחזיר name, email, picture
  } catch (error) {
    console.error("Failed to fetch Google user info", error);
    throw error;
  }
}

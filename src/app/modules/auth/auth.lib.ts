import axios from 'axios';

export const facebookUser = async (token: string) =>
  (
    await axios.get(
      `https://graph.facebook.com/me?access_token=${token}&fields=name,email,picture.width(300).height(300)`
    )
  ).data;

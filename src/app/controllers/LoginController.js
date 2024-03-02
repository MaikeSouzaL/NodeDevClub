import * as Yup from 'yup';

import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

import User from '../models/Users';

class LoginController {
  // vamos usar o store pois estamos enviando dados ao banco de dados
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    function ErrorEmailPassword() {
      return res
        .status(400)
        .json({ error: 'Make sure your password or email are correct' });
    }

    if (!(await schema.isValid(req.body))) {
      ErrorEmailPassword();
    }
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      ErrorEmailPassword();
    }
    if (!(await user.checkPassword(password))) {
      ErrorEmailPassword();
    }
    return res.json({
      id: user.id,
      name: user.mane,
      admin: user.admin,
      // token: jwt.sign({ id: user.id }, 'a25b9b903a77cb0fe10fa61a35e7b2b1', {
      //   expiresIn: '5d',
      // }),
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new LoginController();

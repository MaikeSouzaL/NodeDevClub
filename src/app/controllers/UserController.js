import { v4 } from 'uuid';
import * as Yup from 'yup';

import User from '../models/Users';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(8),
      admin: Yup.boolean(),
    });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Make sure your data is correct' });
    // }

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { name, email, password, admin } = req.body;

    const emailExists = await User.findOne({
      where: { email },
    });
    if (emailExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    // return res.json(user);
    return res.status(201).json({ id: user.id, name, email, admin });
  }
}

export default new UserController();

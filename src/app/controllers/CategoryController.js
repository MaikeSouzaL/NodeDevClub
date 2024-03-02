import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/Users';

class CategoryController {
  async store(req, res) {
    // validando a entrada dos dados
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    // verificando os dados
    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    // APENAS USUARIOS COM STATUS ADMIN PODEM CADASTRAR CATEGORIAS
    const { admin: isAdmin } = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res.status(401).json({ messagem: 'Unautorized' });
    }

    // pegando apenas o que queremos
    const { name } = req.body;
    // vamos verificar se a categoria ja existe
    const categoryExistes = await Category.findOne({
      where: {
        name: name,
      },
    });
    // se existir de um error
    if (categoryExistes) {
      return res.status(400).json({
        error: 'Category already exists',
      });
    }
    // se não existir cria no banco de dados
    const id = await Category.create({ name });
    // retornando assim que for criado
    return res.json({ name, id });
  }

  // Buscando todos os dados
  async index(req, res) {
    const category = await Category.findAll();
    return res.json(category);
  }
}

export default new CategoryController();

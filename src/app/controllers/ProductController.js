import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/Users';

class ProductController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    // APENAS USUARIOS COM STATUS ADMIN PODEM ALTERAR UM PRODUTO
    const { admin: isAdmin } = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res.status(401).json({ messagem: 'Unautorized' });
    }

    const { filename: path } = req.file;
    const { name, price, category_id } = req.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
    });

    return res.json(product);
  }

  async index(req, res) {
    // quando fazermos a busca tambem queremos que retorna os danos relacionado á category buscando o nome e o id
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.json(products);
  }
}

export default new ProductController();

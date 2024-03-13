import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/Users';

class ProductController {
  // criar um novo produto
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    // criar um novo Produto
    // APENAS USUARIOS COM STATUS ADMIN PODEM ALTERAR UM PRODUTO
    const { admin: isAdmin } = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res.status(401).json({ messagem: 'Unautorized' });
    }

    const { filename: path } = req.file;
    const { name, price, category_id, offer } = req.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      path,
      offer,
    });

    return res.json(product);
  }

  // Buscar um produto
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

  // editar o produto
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    // criar um novo Produto
    // APENAS USUARIOS COM STATUS ADMIN PODEM ALTERAR UM PRODUTO
    const { admin: isAdmin } = await User.findByPk(req.userId);
    if (!isAdmin) {
      return res.status(401).json({ messagem: 'Unautorized' });
    }

    // vamos verificar se  existe o produto no banco de dados atraves do id que ele nos mandar!
    const { id } = req.params;
    const productId = await Product.findByPk(id); //  buscando o produto
    // se nao tiver de um erro
    if (!productId) {
      return res
        .status(401)
        .json({ error: 'Make sure your product is correct!' });
    }

    // verificando se o usuario mandou uma imagem
    let path;
    if (req.file) {
      path = req.file.filename;
    }

    const { name, price, category_id, offer } = req.body;

    const product = await Product.update(
      {
        name,
        price,
        category_id,
        path,
        offer,
      },
      { where: { id } }, // estamos atualisando os dados aonde o id for igual ao id mandando pelo usuario
    );

    return res.status(200).json({ message: 'Update successful' });
  }
  // excluindo Produto
  async destroy(req, res) {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      // console.log(product);
      if (!product) {
        return res.status(4004).json({ message: 'Product not found' });
      }
      const { admin: isAdmin } = await User.findByPk(req.userId);
      if (!isAdmin) {
        return res.status(401).json({ messagem: 'Unautorized' });
      }
      await product.destroy();
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    return res.status(204).send();
  }
}

export default new ProductController();

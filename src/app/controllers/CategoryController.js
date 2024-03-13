import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/Users';
import Product from '../models/Product';

class CategoryController {
  // criando categoria
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
    const { filename: path } = req.file;
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
    const { id } = await Category.create({ name, path });
    // retornando assim que for criado
    return res.json({ name, id });
  }

  // fazendo update em categoria
  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
      });

      // verificando os dados do yup
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

      /**verificando se esta vindo nome e id  */
      const { name } = req.body;
      const { id } = req.params;

      // verificando se a categoria existe
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(400).json({ error: 'Category not found' });
      }
      /**verificando se esta enviando o arquivo novo */
      let path;
      // se tiver
      if (req.file) {
        path = req.file.filename;
      }

      // se não existir cria no banco de dados
      await Category.update({ name, path }, { where: { id } });

      // retornando assim que for criado
      return res.status(200).json();
    } catch (error) {
      return res.json({ error: error });
    }
  }

  // Buscando todos os dados
  async index(req, res) {
    const category = await Category.findAll();
    return res.json(category);
  }

  // deletando uma categoria
  async destroy(req, res) {
    const { id } = req.params;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      const { admin: isAdmin } = await User.findByPk(req.userId);
      if (!isAdmin) {
        return res.status(401).json({ messagem: 'Unauthorized' });
      }

      const productsWithCategory = await Product.findAll({
        where: {
          category_id: id,
        },
        attributes: ['id', 'name', 'offer'],
      });

      if (productsWithCategory.length === 0) {
        await category.destroy();
        return res.status(204).send();
      } else {
        // Se houverem produtos associados, retornamos um erro 400 junto com a lista de produtos
        return res.status(400).json({
          error: 'Category has associated products. Cannot delete.',
          products: productsWithCategory,
        });
      }
    } catch (error) {
      console.log(id);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new CategoryController();

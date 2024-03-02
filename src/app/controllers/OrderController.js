import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import Orders from '../schemas/Orders';
import User from '../models/Users';

class OrderController {
  // criando nova ordem
  async store(req, res) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });

    try {
      await schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    // procure o objeto de produdos e mapeia os ids
    const productsId = req.body.products.map((product) => product.id);
    // procure todos os prdutos
    const updateProducts = await Product.findAll({
      // onde contenha os ids
      where: {
        id: productsId,
      },
      // incluindo o model de Category que vou chamar de category dentro de categry procure o nome
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });
    // com os produtos em maos faz outro map
    const editProducts = updateProducts.map((product) => {
      // procure pelo index e cada index que for igual ao produto do index
      const productIndex = req.body.products.findIndex(
        (reqProdutc) => reqProdutc.id === product.id,
      );
      // crie uma const de novos produtos
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: req.body.products[productIndex].quantity,
      };

      return newProduct;
    });
    // contruindo como devera salvar
    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: editProducts,
      status: 'Pedido realizado',
    };
    // salvando de fato no banco de dados
    const orderResponse = await Orders.create(order);
    return res.status(201).json(orderResponse);
  }

  // buscando todas as orders
  async index(req, res) {
    const orders = await Orders.find();
    return res.json(orders);
  }

  // buscando apenas uma ordem
  async show(req, res) {
    try {
      const { id } = req.params;
      // Verifique se o ID é válido
      if (!id) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      let order;
      try {
        order = await Orders.findOne({ _id: id });
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching order' });
      }
      return res.json(order);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  // atualizando o status das ordes
  async update(req, res) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    });
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

    const { id } = req.params; // pega o id no params
    const { status } = req.body; // pega o id no body
    // Vai em Orders e faz um opdate onde contem o _id com o valor recebido em id do params e assim que achar o _id troque o valor da chave status para status que esta vindo do body
    try {
      await Orders.updateOne({ _id: id }, { status: status });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.json({ message: 'Status updated sucessfully' });
  }
}

export default new OrderController();

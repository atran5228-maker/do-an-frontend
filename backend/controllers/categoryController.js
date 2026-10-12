const Category = require('../models/Category');

// Lấy tất cả danh mục của user đang đăng nhập
async function getCategories(req, res) {
  try {
    const categories = await Category.findAll({
      where: { user_id: req.user.id }, // chỉ lấy danh mục của đúng user này
      order: [['createdAt', 'DESC']],  // mới nhất lên trước
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Tạo danh mục mới
async function createCategory(req, res) {
  try {
    const { name, type, icon, color } = req.body;

    if (!name || !type) {
      return res.status(400).json({ message: 'Vui lòng nhập name và type' });
    }
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'type phải là income hoặc expense' });
    }

    const newCategory = await Category.create({
      name,
      type,
      icon,
      color,
      user_id: req.user.id, // lấy từ middleware, KHÔNG lấy từ req.body (tránh giả mạo user khác)
    });

    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Sửa danh mục
async function updateCategory(req, res) {
  try {
    const { id } = req.params; // lấy id từ URL, vd: /api/categories/5
    const category = await Category.findOne({ where: { id, user_id: req.user.id } });

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    const { name, type, icon, color } = req.body;
    await category.update({ name, type, icon, color });

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

// Xóa danh mục
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const category = await Category.findOne({ where: { id, user_id: req.user.id } });

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    await category.destroy();
    return res.status(200).json({ message: 'Đã xóa danh mục' });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
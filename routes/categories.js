const express = require("express");
const router = express.Router();
const Category = require("../models/category");

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    return res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).send(category);
  } catch (error) {
    res.json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).send(category);
  } catch (error) {
    res.json(error);
  }
});

router.post("/", async (req, res) => {
  let category = new Category({
    ...req.body,
  });

  category = await category.save();
  if (!category) {
    return res.status(404).send("the category cannot be created");
  }
  res.status(200).send(category);
});

router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res
          .status(200)
          .json({ success: true, message: "Deleted successfully" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Category not found" });
      }
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;

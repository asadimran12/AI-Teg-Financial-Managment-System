const Asset = require("../model/Assests_model");

// Get all assets
const GetAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.status(200).json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch assets" });
  }
};

// Get single asset by ID
const GetAssetById = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.status(200).json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch asset" });
  }
};

// Create a new asset
const CreateAsset = async (req, res) => {
  const { name, category, purchase_date, value, quantity, location } = req.body;
  try {
    const newAsset = await Asset.create({
      name,
      category,
      purchase_date,
      value,
      quantity,
      location,
    });
    res.status(201).json(newAsset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create asset" });
  }
};

// Update an asset
const UpdateAsset = async (req, res) => {
  const { id } = req.params;
  const { name, category, purchase_date, value, quantity, location } = req.body;
  try {
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    await asset.update({
      name,
      category,
      purchase_date,
      value,
      quantity,
      location,
    });

    res.status(200).json(asset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update asset" });
  }
};

// Delete an asset
const DeleteAsset = async (req, res) => {
  const { id } = req.params;
  try {
    const asset = await Asset.findByPk(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    await asset.destroy();
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete asset" });
  }
};

module.exports={CreateAsset,GetAllAssets,GetAssetById,DeleteAsset,UpdateAsset}

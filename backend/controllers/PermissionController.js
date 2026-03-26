import fs from "fs";
import path from "path";
import { fileURLToPath,pathToFileURL  } from "url";
import { Op } from "sequelize";
import Permission from "../models/Permission.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 controllers folder path
const controllersPath = path.join(__dirname, "../controllers");

// ✅ Get all permissions
const getAllPermissions = async (req, res) => {
  try {
    const data = await Permission.findAll({ order: [["id", "ASC"]] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Get controllers dynamically

const getControllers = async (req, res) => {
  try {
    const files = fs.readdirSync(controllersPath);

    const controllers = files
      .filter(file => file.endsWith(".js"))
      .map(file => file.replace(".js", ""))
      .filter(name => name !== "PermissionController");

    res.json(controllers);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// 🔥 MAIN API (FIXED)
const getControllerPermissions = async (req, res) => {
  try {
    const { controller } = req.params;
    const controllerPath = path.join(controllersPath, `${controller}.js`);
    const fileUrl = pathToFileURL(controllerPath).href;
    const controllerModule = await import(fileUrl);

    const controllerFunction = Object.keys(controllerModule).filter(
      key => typeof controllerModule[key] === "function"
    );
    // console.log(controllerFunction);

    // 🔥 DB DATA
    const dbPermissions = await Permission.findAll({
      where: { controller },
      // logging: (query) => {
      //   console.log("🔥 SQL:", query);
      // }
    });

    const dbData = dbPermissions.map(p => p.toJSON());
    // 🔥 MERGE LOGIC (FIXED)
    const finalData = controllerFunction.map((fn) => {
      const dbMatch = dbData.find(p => p.method === fn);

      if (dbMatch) {
        return {
          ...dbMatch,
          method: fn,
          controller,
          is_new: false
        };
      }

      return {
        id: null,
        module: "",
        controller,
        method: fn,
        parent_method: "",
        method_title: "",
        status: false,
        for_admin: false,
        for_customer: false,
        is_new: true
      };
    });

    return res.json({
      controller,
      total_functions: controllerFunction.length,
      data: finalData
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: err.message });
  }
};



const createPermission = async (req, res) => {
  try {
    const { module, controller, method, method_title, parent_method, status, for_admin, for_organization, for_vendor} = req.body;
    // ✅ Validation
    if (!module || !controller || !method || !method_title) {
      return res.status(400).json({
        status: false,
        errors: {
          module: !module ? "Module required" : null,
          controller: !controller ? "Controller required" : null,
          method: !method ? "Method required" : null,
          method_title: !method_title ? "Method title required" : null
        }
      });
    }

    // ✅ If parent_method exists → inherit values
    if (parent_method) {
      const parent = await Permission.findOne({
        where: { method: parent_method, controller }
      });

      if (!parent) {
        return res.status(400).json({
          status: false,
          errors: "Parent method does not exist"
        });
      }
    } 
    const data = await Permission.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

const updatePermission = async (req, res) => {
  try {
    const { module, controller, method, method_title, parent_method, status, for_admin, for_organization, for_vendor} = req.body;
    if (!module || !controller || !method || !method_title) {
      return res.status(400).json({
        status: false,
        errors: {
          module: !module ? "Module required" : null,
          controller: !controller ? "Controller required" : null,
          method: !method ? "Method required" : null,
          method_title: !method_title ? "Method title required" : null
        }
      });
    }

    const data = await Permission.findByPk(req.params.id);
    if (!data){
        return res.status(404).json({ msg: "Not found" });
    }

    // ✅ If parent_method exists → inherit values
    if (parent_method) {
      const parent = await Permission.findOne({
        where: {
          method: parent_method,
          controller: controller,
          id: { [Op.ne]: req.params.id }
        }
        
      });
      if (!parent) {
        return res.status(400).json({
          status: false,
          errors: "Parent method does not exist"
        });
      }
    }

    await data.update(req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const deletePermission = async (req, res) => {
  try {
    const data = await Permission.findByPk(req.params.id);
    if (!data) return res.status(404).json({ msg: "Not found" });

    await data.destroy();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export {
  getAllPermissions,
  getControllers,
  createPermission,
  updatePermission,
  deletePermission,
  getControllerPermissions
};
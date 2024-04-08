const fs = require("fs").promises;
const path = require("path");
// 检查目录是否存在
const directoryExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath);
    return true;
  } catch (error) {
    return false;
  }
};

// 检查文件是否存在
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * 将上传的图片保存到服务器当中
 * base64Image:image对象转化成的base64编码的字符流
 * savePath:保存的路径
 * fileName:保存文件的名称，要求唯一
 */

const saveImage = async (base64Image, savePath, fileName) => {
  try {
    const outputDirectory = path.resolve(__dirname, `../${savePath}`);
    if (!(await directoryExists(outputDirectory))) {
      await fs.mkdir(outputDirectory);
    }
    const fileOutputPath = path.resolve(outputDirectory, fileName);
    if (await fileExists(fileOutputPath)) {
      console.log(`File ${fileOutputPath} already exists.`);
      return;
    }
    console.log(`Saving image to ${fileOutputPath}`);
    // 将 Base64 编码的字符串解码为 Buffer 对象
    const imageBuffer = Buffer.from(base64Image, "base64");
    await fs.writeFile(fileOutputPath, imageBuffer, "binary");
  } catch (error) {
    console.error("Error saving image:", error);
  }
};

module.exports = { saveImage };

const fs = require("fs");
const path = require("path");

const filePath = path.resolve(
  __dirname,
  "node_modules/@angular/fire/compat/database/interfaces.d.ts"
);

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error leyendo el archivo:", err);
    process.exit(1);
  }

  const updatedData = data.replace(
    "forEach(action: (a: DatabaseSnapshot<T>) => boolean): boolean;",
    "forEach(action: (a: any) => boolean): boolean;"
  );

  fs.writeFile(filePath, updatedData, "utf8", (err) => {
    if (err) {
      console.error("Error escribiendo el archivo:", err);
      process.exit(1);
    }
    console.log("Parche aplicado correctamente.");
  });
});

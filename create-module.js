import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a module
const createModule = moduleName => {
  // Define paths
  const modulePath = path.join(__dirname, 'src', 'app', 'modules', moduleName);

  // Check if the module already exists
  if (fs.existsSync(modulePath)) {
    console.error(`Module "${moduleName}" already exists.`);
    return;
  }

  // Create the module folder
  fs.mkdirSync(modulePath, { recursive: true });

  // Define files and their default content
  const files = [
    {
      name: `${moduleName}.constant.ts`,
      content: `export const ${moduleName.toUpperCase()}_SEARCHABLE_FIELDS = ['name', 'description', 'atcCodes'];\n`,
    },
    {
      name: `${moduleName}.interface.ts`,
      content: `import { Model } from 'mongoose';

export type T${capitalize(moduleName)} = {
  name: string;
  description?: string;
  atcCodes: string;
  isDeleted: boolean;
};

export interface ${capitalize(moduleName)}Model extends Model<T${capitalize(
        moduleName
      )}> {
  is${capitalize(moduleName)}Exists(id: string): Promise<T${capitalize(
        moduleName
      )} | null>;
}
`,
    },
    {
      name: `${moduleName}.controller.ts`,
      content: `import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ${capitalize(moduleName)}Services } from './${moduleName}.service';

const create${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { ${moduleName}: ${moduleName}Data } = req.body;
  const result = await ${capitalize(moduleName)}Services.create${capitalize(
        moduleName
      )}IntoDB(${moduleName}Data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '${capitalize(moduleName)} is created successfully',
    data: result,
  });
});

const getSingle${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ${capitalize(moduleName)}Services.getSingle${capitalize(
        moduleName
      )}FromDB(id)
;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '${capitalize(moduleName)} is retrieved successfully',
    data: result,
  });
});

const getAll${capitalize(moduleName)}s = catchAsync(async (req, res) => {
  const result = await ${capitalize(moduleName)}Services.getAll${capitalize(
        moduleName
      )}sFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '${capitalize(moduleName)}s are retrieved successfully',
    data: result,
  });
});

const update${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ${moduleName} } = req.body;
  const result = await ${capitalize(moduleName)}Services.update${capitalize(
        moduleName
      )}IntoDB(id, ${moduleName});

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '${capitalize(moduleName)} is updated successfully',
    data: result,
  });
});

const delete${capitalize(moduleName)} = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ${capitalize(moduleName)}Services.delete${capitalize(
        moduleName
      )}FromDB(id)
;

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: '${capitalize(moduleName)} is deleted successfully',
    data: result,
  });
});

export const ${capitalize(moduleName)}Controllers = {
  create${capitalize(moduleName)},
  getSingle${capitalize(moduleName)},
  getAll${capitalize(moduleName)}s,
  update${capitalize(moduleName)},
  delete${capitalize(moduleName)},
};
`,
    },
    {
      name: `${moduleName}.route.ts`,
      content: `import express from 'express';
import { ${capitalize(
        moduleName
      )}Controllers } from './${moduleName}.controller';
import validateRequest from '../../middlewares/validateRequest';
import { create${capitalize(moduleName)}ValidationSchema, update${capitalize(
        moduleName
      )}ValidationSchema } from './${moduleName}.validation';

const router = express.Router();

router.post(
  '/create-${moduleName}',
  validateRequest(create${capitalize(moduleName)}ValidationSchema),
  ${capitalize(moduleName)}Controllers.create${capitalize(moduleName)},
);

router.get(
  '/:id',
  ${capitalize(moduleName)}Controllers.getSingle${capitalize(moduleName)},
);

router.patch(
  '/:id',
  validateRequest(update${capitalize(moduleName)}ValidationSchema),
  ${capitalize(moduleName)}Controllers.update${capitalize(moduleName)},
);

router.delete(
  '/:id',
  ${capitalize(moduleName)}Controllers.delete${capitalize(moduleName)},
);

router.get(
  '/',
  ${capitalize(moduleName)}Controllers.getAll${capitalize(moduleName)}s,
);

export const ${capitalize(moduleName)}Routes = router;
`,
    },
    {
      // Updated service content
      name: `${moduleName}.service.ts`,
      content: `
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { ${capitalize(
        moduleName
      )}SearchableFields } from './${moduleName}.constant';
import mongoose from 'mongoose';
import { T${capitalize(moduleName)} } from './${moduleName}.interface';
import { ${capitalize(moduleName)} } from './${moduleName}.model';

const create${capitalize(moduleName)}IntoDB = async (
  payload: T${capitalize(moduleName)},
) => {
  const result = await ${capitalize(moduleName)}.create(payload);
  
  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create ${capitalize(
      moduleName
    )}');
  }

  return result;
};

const getAll${capitalize(
        moduleName
      )}sFromDB = async (query: Record<string, unknown>) => {
  const ${capitalize(moduleName)}Query = new QueryBuilder(
    ${capitalize(moduleName)}.find(),
    query,
  )
    .search(${capitalize(moduleName)}SearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await ${capitalize(moduleName)}Query.modelQuery;
  const meta = await ${capitalize(moduleName)}Query.countTotal();
  return {
    result,
    meta,
  };
};

const getSingle${capitalize(moduleName)}FromDB = async (id: string) => {
  const result = await ${capitalize(moduleName)}.findById(id)
;

  return result;
};

const update${capitalize(
        moduleName
      )}IntoDB = async (id: string, payload: any) => {
  const isDeletedService = await mongoose.connection
    .collection('${moduleName.toLowerCase()}s')
    .findOne(
      { _id: new mongoose.Types.ObjectId(id)
 },
      { projection: { isDeleted: 1, name: 1 } },
    );

  if (!isDeletedService?.name) {
    throw new Error('${capitalize(moduleName)} not found');
  }

  if (isDeletedService.isDeleted) {
    throw new Error('Cannot update a deleted ${moduleName}');
  }

  const updatedData = await ${capitalize(moduleName)}.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true },
  );

  if (!updatedData) {
    throw new Error('${capitalize(moduleName)} not found after update');
  }

  return updatedData;
};

const delete${capitalize(moduleName)}FromDB = async (id: string) => {
  const deletedService = await ${capitalize(moduleName)}.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!deletedService) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to delete ${capitalize(
      moduleName
    )}');
  }

  return deletedService;
};

export const ${capitalize(moduleName)}Services = {
  create${capitalize(moduleName)}IntoDB,
  getAll${capitalize(moduleName)}sFromDB,
  getSingle${capitalize(moduleName)}FromDB,
  update${capitalize(moduleName)}IntoDB,
  delete${capitalize(moduleName)}FromDB,
};
`,
    },
    {
      name: `${moduleName}.model.ts`,
      content: `import { Schema, model } from 'mongoose';
      import { T${capitalize(moduleName)}, ${capitalize(
        moduleName
      )}Model } from './${moduleName}.interface';
      
      const ${moduleName}Schema = new Schema<T${capitalize(
        moduleName
      )}, ${capitalize(moduleName)}Model>({
        name: { type: String, required: true },
        description: { type: String },
        atcCodes: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
      });
      
      ${moduleName}Schema.statics.is${capitalize(
        moduleName
      )}Exists = async function (id: string) {
        return await this.findOne({ _id: id, isDeleted: false });
      };
      
      export const ${capitalize(moduleName)} = model<T${capitalize(
        moduleName
      )}, ${capitalize(moduleName)}Model>('${capitalize(
        moduleName
      )}', ${moduleName}Schema);
      `,
    },
    {
      name: `${moduleName}.validation.ts`,
      content: `import { z } from 'zod';

export const create${capitalize(moduleName)}ValidationSchema = z.object({
  body: z.object({
    ${moduleName}: z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      atcCodes: z.string().min(1),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const update${capitalize(moduleName)}ValidationSchema = z.object({
  body: z.object({
    ${moduleName}: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      atcCodes: z.string().optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
`,
    },
  ];
  // Create files with default content
  files.forEach(file => {
    const filePath = path.join(modulePath, file.name);
    fs.writeFileSync(filePath, file.content);
  });

  console.log(`Module "${moduleName}" has been created successfully.`);
};

// Utility function to capitalize module names
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

// Get the module name from the command line arguments
const moduleName = process.argv[2];
if (!moduleName) {
  console.error('Please provide a module name.');
  process.exit(1);
}

// Create the module
createModule(moduleName);

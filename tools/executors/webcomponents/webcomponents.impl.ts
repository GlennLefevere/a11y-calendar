import {
    ExecutorContext,
    readJsonFile,
    writeJsonFile,
} from '@nx/devkit';
import { join } from 'path';
import { TypeScriptExecutorOptions } from './schema';

export async function schematicsExecutor(
    options: TypeScriptExecutorOptions,
    context: ExecutorContext,
) {
    updatePackageJson(options);

    return {
        success: true,
    };
}

interface PackageJson {
    main: string;
    module: string;
    es2015: string;
    es2017: string;
    types: string;
    collection: string;
    'collection:main': string;
    unpkg: string;
}

function updatePackageJson(options: TypeScriptExecutorOptions): void {
    const packageJson = readJsonFile<PackageJson>(
        join(options.outputPath, 'package.json'),
    );

    packageJson.main = packageJson.main.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.module = packageJson.module.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.es2015 = packageJson.es2015.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.es2017 = packageJson.es2017.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.types = packageJson.types.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.collection = packageJson.collection.replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson['collection:main'] = packageJson['collection:main'].replace(
        `../../${options.outputPath}/`,
        '',
    );
    packageJson.unpkg = packageJson.unpkg.replace(
        `../../${options.outputPath}/`,
        '',
    );

    const outputPackageJson = join(options.outputPath, 'package.json');
    writeJsonFile(outputPackageJson, packageJson);
}

export default schematicsExecutor;

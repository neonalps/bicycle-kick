import { ClubId, PersonId } from "@src/util/domain-types";
import { StorageFile } from "./service";

export function getFileTypeFromFilename(filename: string): string {
    return filename.substring(filename.lastIndexOf('.') + 1);
}

export function assertValidFileType(fileType: string, allowedFileTypes: string[]) {
    if (!allowedFileTypes.includes(fileType)) {
        throw new Error(`Invalid file type: '${fileType}'. Allowed are: ${allowedFileTypes.join(', ')}`);
    }
}

export function getFullPathFromFile(file: StorageFile): string {
    return `${file.path}/${file.filename}`;
}

export function getStorageFileFromFullPath(fullPath: string): StorageFile {
    if (fullPath.endsWith('/')) {
        throw new Error(`File path must not end with a slash`);
    }

    const filenameIndex = fullPath.lastIndexOf('/');
    return {
        path: fullPath.substring(0, filenameIndex),
        filename: fullPath.substring(filenameIndex + 1),
    }
}

export function getClubStorageFile(clubId: ClubId, fileType: string): StorageFile {
    return {
        path: 'c',
        filename: `${clubId}.${fileType}`,
    };
}

export function getPersonStorageFile(personId: PersonId, fileType: string): StorageFile {
    return {
        path: 'p',
        filename: `${personId}.${fileType}`,
    };
}
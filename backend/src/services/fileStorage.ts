import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';
import { config } from '@/config';

export interface FileUpload {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

export interface FileDownload {
  file: Buffer;
  filename: string;
  mimeType: string;
}

export class FileStorageService {
  private uploadDir: string;
  private allowedMimeTypes: Set<string>;

  constructor() {
    this.uploadDir = config.upload.dir;
    this.allowedMimeTypes = new Set(config.upload.allowedTypes);
    this.ensureUploadDirectory();
  }

  /**
   * Ensure upload directory exists
   */
  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info(`Upload directory ensured: ${this.uploadDir}`);
    } catch (error) {
      logger.error('Failed to create upload directory', error);
      throw error;
    }
  }

  /**
   * Configure multer for file uploads
   */
  public configureMulter(): multer.Multer {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
      },
    });

    const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
      // Check file type
      const extension = path.extname(file.originalname).toLowerCase().substring(1);
      if (this.allowedMimeTypes.has(extension) || this.allowedMimeTypes.has(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${extension} is not allowed`));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: config.upload.maxFileSize,
        files: 5, // Maximum 5 files at once
      },
    });
  }

  /**
   * Handle file upload and create database record
   */
  public async handleFileUpload(
    file: Express.Multer.File,
    uploadedBy: string,
    metadata?: Record<string, any>
  ): Promise<FileUpload> {
    try {
      const fileUpload: FileUpload = {
        id: uuidv4(),
        originalName: (file as any).originalname,
        filename: (file as any).filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        uploadedBy,
        uploadedAt: new Date(),
        metadata,
      };

      // Here you would save to database
      // await this.saveFileToDatabase(fileUpload);

      logger.info(`File uploaded: ${file.originalname} by ${uploadedBy}`);
      return fileUpload;
    } catch (error) {
      logger.error('Failed to handle file upload', error);
      throw error;
    }
  }

  /**
   * Get file by ID
   */
  public async getFile(fileId: string): Promise<FileDownload> {
    try {
      // Here you would retrieve from database
      // const fileRecord = await this.getFileFromDatabase(fileId);

      // For now, let's assume we have the file path
      const filePath = path.join(this.uploadDir, fileId);

      // Check if file exists
      await fs.access(filePath);

      // Read file
      const fileBuffer = await fs.readFile(filePath);

      // Determine MIME type (you'd get this from database)
      const mimeType = 'application/octet-stream'; // Default

      return {
        file: fileBuffer,
        filename: fileId,
        mimeType,
      };
    } catch (error) {
      logger.error('Failed to get file', error);
      throw error;
    }
  }

  /**
   * Delete file
   */
  public async deleteFile(fileId: string): Promise<void> {
    try {
      // Here you would retrieve from database first
      // const fileRecord = await this.getFileFromDatabase(fileId);

      // Delete from filesystem
      const filePath = path.join(this.uploadDir, fileId);
      await fs.unlink(filePath);

      // Delete from database
      // await this.deleteFileFromDatabase(fileId);

      logger.info(`File deleted: ${fileId}`);
    } catch (error) {
      logger.error('Failed to delete file', error);
      throw error;
    }
  }

  /**
   * Get file info
   */
  public async getFileInfo(fileId: string): Promise<FileUpload> {
    try {
      // Here you would retrieve from database
      // const fileRecord = await this.getFileFromDatabase(fileId);
      // return fileRecord;

      // For now, return basic info
      const filePath = path.join(this.uploadDir, fileId);
      const stats = await fs.stat(filePath);

      return {
        id: fileId,
        originalName: fileId,
        filename: fileId,
        mimeType: 'application/octet-stream',
        size: stats.size,
        path: filePath,
        uploadedBy: 'unknown',
        uploadedAt: stats.mtime,
      };
    } catch (error) {
      logger.error('Failed to get file info', error);
      throw error;
    }
  }

  /**
   * Validate file before upload
   */
  public validateFile(file: Express.Multer.File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > config.upload.maxFileSize) {
      return {
        valid: false,
        error: `File size ${file.size} exceeds maximum allowed size ${config.upload.maxFileSize}`,
      };
    }

    // Check file type
    const extension = path.extname(file.originalname).toLowerCase().substring(1);
    if (!this.allowedMimeTypes.has(extension) && !this.allowedMimeTypes.has(file.mimetype)) {
      return {
        valid: false,
        error: `File type ${extension} is not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Generate signed URL for file download (if using cloud storage)
   */
  public generateDownloadUrl(fileId: string, expiresIn: number = 3600): string {
    // This would generate a signed URL for cloud storage
    // For local storage, return a regular URL
    return `/api/files/${fileId}/download`;
  }

  /**
   * Create thumbnail for image files
   */
  public async createThumbnail(filePath: string, thumbnailPath: string): Promise<string> {
    try {
      // This would use an image processing library like sharp
      // For now, just return the original path
      logger.info(`Thumbnail creation requested for: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('Failed to create thumbnail', error);
      throw error;
    }
  }

  /**
   * Scan file for viruses (if antivirus is available)
   */
  public async scanFile(filePath: string): Promise<{ clean: boolean; threat?: string }> {
    try {
      // This would integrate with antivirus software
      // For now, just return clean
      logger.info(`File scan requested for: ${filePath}`);
      return { clean: true };
    } catch (error) {
      logger.error('Failed to scan file', error);
      throw error;
    }
  }

  /**
   * Get storage statistics
   */
  public async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    usedSpace: number;
    availableSpace: number;
  }> {
    try {
      const files = await fs.readdir(this.uploadDir);
      let totalSize = 0;

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      }

      return {
        totalFiles: files.length,
        totalSize,
        usedSpace: totalSize,
        availableSpace: config.upload.maxFileSize * 100, // Example calculation
      };
    } catch (error) {
      logger.error('Failed to get storage stats', error);
      throw error;
    }
  }

  /**
   * Cleanup old files
   */
  public async cleanupOldFiles(olderThanDays: number): Promise<number> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile() && stats.mtime < cutoffDate) {
          await fs.unlink(filePath);
          deletedCount++;
        }
      }

      logger.info(`Cleaned up ${deletedCount} old files`);
      return deletedCount;
    } catch (error) {
      logger.error('Failed to cleanup old files', error);
      throw error;
    }
  }

  /**
   * Compress file if it's too large
   */
  public async compressFile(filePath: string): Promise<string> {
    try {
      // This would implement file compression
      // For now, just return the original path
      logger.info(`File compression requested for: ${filePath}`);
      return filePath;
    } catch (error) {
      logger.error('Failed to compress file', error);
      throw error;
    }
  }
}

// Export singleton instance
export const fileStorageService = new FileStorageService();
export default FileStorageService;
"""
Unit tests for KYC file upload validation.
Tests file size limits, MIME type validation, and filename sanitization.
"""
import pytest
from fastapi import HTTPException, UploadFile
from io import BytesIO
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.api.auth import validate_kyc_file


class TestKYCFileValidation:
    """Test suite for KYC file upload validation."""
    
    @pytest.mark.asyncio
    async def test_file_too_large(self):
        """Test file size validation - reject files over 5MB."""
        # Create a 6MB file
        large_content = b'0' * (6 * 1024 * 1024)
        large_file = BytesIO(large_content)
        upload_file = UploadFile(filename="large.pdf", file=large_file)
        
        with pytest.raises(HTTPException) as exc_info:
            await validate_kyc_file(upload_file, "Test Document")
        
        assert exc_info.value.status_code == 400
        assert "exceeds 5MB" in exc_info.value.detail
        assert "Test Document" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_invalid_file_type_executable(self):
        """Test MIME type validation - reject executable files."""
        # Create fake Windows PE executable (magic bytes: MZ)
        exe_content = b'MZ\x90\x00' + b'\x00' * 100
        exe_file = BytesIO(exe_content)
        upload_file = UploadFile(filename="malware.pdf", file=exe_file)
        
        with pytest.raises(HTTPException) as exc_info:
            await validate_kyc_file(upload_file, "ID Document")
        
        assert exc_info.value.status_code == 400
        assert "Invalid file type" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_invalid_file_type_text(self):
        """Test MIME type validation - reject plain text files."""
        # Plain text file
        text_content = b'This is a plain text file'
        text_file = BytesIO(text_content)
        upload_file = UploadFile(filename="document.txt", file=text_file)
        
        with pytest.raises(HTTPException) as exc_info:
            await validate_kyc_file(upload_file, "Proof of Address")
        
        assert exc_info.value.status_code == 400
        assert "Invalid file type" in exc_info.value.detail
        assert "JPG, PNG, and PDF" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_path_traversal_attack(self):
        """Test filename validation - prevent path traversal."""
        # Valid PDF content
        pdf_content = b'%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
        pdf_file = BytesIO(pdf_content)
        
        # Test various path traversal attempts
        malicious_filenames = [
            "../../../etc/passwd",
            "..\\..\\..\\windows\\system32\\config\\sam",
            "uploads/../../../etc/shadow",
        ]
        
        for filename in malicious_filenames:
            upload_file = UploadFile(filename=filename, file=BytesIO(pdf_content))
            
            with pytest.raises(HTTPException) as exc_info:
                await validate_kyc_file(upload_file, "Business Document")
            
            assert exc_info.value.status_code == 400
            assert "Invalid filename" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_double_extension(self):
        """Test filename validation - reject double extensions."""
        # Valid PDF content
        pdf_content = b'%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
        
        # Test double extensions
        malicious_filenames = [
            "document.pdf.exe",
            "file.jpg.sh",
            "image.png.bat",
        ]
        
        for filename in malicious_filenames:
            pdf_file = BytesIO(pdf_content)
            upload_file = UploadFile(filename=filename, file=pdf_file)
            
            with pytest.raises(HTTPException) as exc_info:
                await validate_kyc_file(upload_file, "Tax Document")
            
            assert exc_info.value.status_code == 400
            assert "multiple extensions" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_valid_pdf(self):
        """Test successful PDF validation."""
        # Valid PDF content with proper header
        pdf_content = b'%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\n'
        pdf_file = BytesIO(pdf_content)
        upload_file = UploadFile(filename="document.pdf", file=pdf_file)
        
        result = await validate_kyc_file(upload_file, "ID Document")
        
        # Should return the file contents
        assert result == pdf_content
    
    @pytest.mark.asyncio
    async def test_valid_jpeg(self):
        """Test successful JPEG validation."""
        # Valid JPEG content (minimal JPEG header)
        jpeg_content = (
            b'\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00'
            b'\xFF\xDB\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c'
            b'\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c'
            b'\xFF\xD9'  # End of image marker
        )
        jpeg_file = BytesIO(jpeg_content)
        upload_file = UploadFile(filename="photo.jpg", file=jpeg_file)
        
        result = await validate_kyc_file(upload_file, "Proof of Address")
        
        # Should return the file contents
        assert result == jpeg_content
    
    @pytest.mark.asyncio
    async def test_valid_png(self):
        """Test successful PNG validation."""
        # Valid PNG content (minimal PNG header and IEND chunk)
        png_content = (
            b'\x89PNG\r\n\x1a\n'  # PNG signature
            b'\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
            b'\x08\x02\x00\x00\x00\x90wS\xDE'  # IHDR chunk
            b'\x00\x00\x00\x0cIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01'
            b'\r\n-\xb4'  # IDAT chunk
            b'\x00\x00\x00\x00IEND\xaeB`\x82'  # IEND chunk
        )
        png_file = BytesIO(png_content)
        upload_file = UploadFile(filename="scan.png", file=png_file)
        
        result = await validate_kyc_file(upload_file, "Business Document")
        
        # Should return the file contents
        assert result == png_content
    
    @pytest.mark.asyncio
    async def test_empty_file(self):
        """Test validation of empty file."""
        empty_file = BytesIO(b'')
        upload_file = UploadFile(filename="empty.pdf", file=empty_file)
        
        with pytest.raises(HTTPException) as exc_info:
            await validate_kyc_file(upload_file, "ID Document")
        
        assert exc_info.value.status_code == 400
        assert "Invalid file type" in exc_info.value.detail
    
    @pytest.mark.asyncio
    async def test_file_exactly_at_limit(self):
        """Test file exactly at 5MB limit (should pass)."""
        # Create exactly 5MB of valid PDF content
        pdf_header = b'%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
        padding_size = (5 * 1024 * 1024) - len(pdf_header)
        content = pdf_header + (b'0' * padding_size)
        
        file = BytesIO(content)
        upload_file = UploadFile(filename="large.pdf", file=file)
        
        # This should succeed as it's exactly at the limit
        result = await validate_kyc_file(upload_file, "Tax Document")
        assert result == content
    
    @pytest.mark.asyncio
    async def test_file_one_byte_over_limit(self):
        """Test file one byte over 5MB limit (should fail)."""
        # Create 5MB + 1 byte
        content = b'0' * (5 * 1024 * 1024 + 1)
        
        file = BytesIO(content)
        upload_file = UploadFile(filename="toolarge.pdf", file=file)
        
        with pytest.raises(HTTPException) as exc_info:
            await validate_kyc_file(upload_file, "ID Document")
        
        assert exc_info.value.status_code == 400
        assert "exceeds 5MB" in exc_info.value.detail


class TestFileStorageSecurity:
    """Test suite for secure file storage."""
    
    def test_storage_directory_creation(self):
        """Test that storage directory is created with proper structure."""
        from app.utils.file_storage import KYC_STORAGE_PATH
        
        assert KYC_STORAGE_PATH.exists()
        assert KYC_STORAGE_PATH.is_dir()
    
    def test_secure_filename_generation(self):
        """Test that filenames are generated securely."""
        from app.utils.file_storage import save_kyc_document
        import tempfile
        import shutil
        
        # Create temporary test directory
        test_dir = tempfile.mkdtemp()
        
        try:
            # Save a test document
            test_content = b'%PDF-1.4\nTest content'
            file_path = save_kyc_document(test_content, 12345, "id_document", "pdf")
            
            # Verify filename structure
            assert "12345" in file_path
            assert "id_document" in file_path
            assert ".pdf" in file_path
            
            # Verify file was created
            from pathlib import Path
            assert Path(file_path).exists()
            
            # Verify file has correct permissions (0o600)
            import stat
            file_stat = os.stat(file_path)
            file_perms = stat.filemode(file_stat.st_mode)
            # On Unix systems, should be -rw-------
            assert (file_stat.st_mode & 0o777) == 0o600
            
        finally:
            # Cleanup
            if os.path.exists(test_dir):
                shutil.rmtree(test_dir)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

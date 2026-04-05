-- Add new columns for canvas customization
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS template_image TEXT,
ADD COLUMN IF NOT EXISTS mask_image TEXT,
ADD COLUMN IF NOT EXISTS max_images INTEGER DEFAULT 1;

-- Update acrylic stand product with new template
UPDATE products 
SET 
  template_image = '/images/product-templates/acrylic-stand-template.png',
  max_images = 1
WHERE category = 'acrylic-stand' OR name ILIKE '%acrylic stand%';

-- Add comments
COMMENT ON COLUMN products.template_image IS 'Path to product template with transparent design area';
COMMENT ON COLUMN products.mask_image IS 'Optional path to mask image for boundary clipping';
COMMENT ON COLUMN products.max_images IS 'Maximum number of images allowed in customization (for future multi-image support)';

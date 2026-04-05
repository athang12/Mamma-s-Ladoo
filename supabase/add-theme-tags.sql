-- Add theme tags to products for proper filtering
-- Run this in Supabase SQL Editor

-- Update Acrylic Stands
UPDATE products 
SET theme_tags = ARRAY['aesthetic', 'valentine', 'custom']
WHERE name LIKE '%Acrylic Stand%';

-- Update Wall Frames
UPDATE products 
SET theme_tags = ARRAY['aesthetic', 'custom']
WHERE name LIKE '%Frame%';

-- Update Fridge Magnets  
UPDATE products 
SET theme_tags = ARRAY['aesthetic', 'cute', 'custom']
WHERE name LIKE '%Magnet%';

-- Update Mugs
UPDATE products 
SET theme_tags = CASE
  WHEN name LIKE '%Anime%' THEN ARRAY['anime']
  WHEN name LIKE '%Motivation%' THEN ARRAY['motivation']
  WHEN name LIKE '%Aesthetic%' THEN ARRAY['aesthetic']
  WHEN name LIKE '%Love%' THEN ARRAY['valentine']
  WHEN name LIKE '%Custom%' THEN ARRAY['custom']
  ELSE ARRAY['aesthetic']
END
WHERE category = 'COFFEE_MUGS';

-- Update Puzzles
UPDATE products 
SET theme_tags = CASE
  WHEN name LIKE '%Anime%' THEN ARRAY['anime']
  WHEN name LIKE '%Inspirational%' OR name LIKE '%Landscape%' THEN ARRAY['motivation', 'aesthetic']
  WHEN name LIKE '%Aesthetic%' THEN ARRAY['aesthetic']
  WHEN name LIKE '%Custom%' THEN ARRAY['custom']
  ELSE ARRAY['aesthetic']
END
WHERE category = 'JIGSAW_PUZZLES';

-- Update Handkerchiefs
UPDATE products 
SET theme_tags = CASE
  WHEN name LIKE '%Anime%' THEN ARRAY['anime']
  WHEN name LIKE '%Motivational%' THEN ARRAY['motivation']
  WHEN name LIKE '%Aesthetic%' OR name LIKE '%Minimalist%' THEN ARRAY['aesthetic']
  WHEN name LIKE '%Custom%' THEN ARRAY['custom']
  ELSE ARRAY['aesthetic']
END
WHERE category = 'HANDKERCHIEFS';

-- Update Tote Bags
UPDATE products 
SET theme_tags = CASE
  WHEN name LIKE '%Anime%' THEN ARRAY['anime']
  WHEN name LIKE '%Motivation%' THEN ARRAY['motivation']
  WHEN name LIKE '%Aesthetic%' OR name LIKE '%Minimalist%' THEN ARRAY['aesthetic']
  WHEN name LIKE '%Custom%' THEN ARRAY['custom']
  ELSE ARRAY['aesthetic']
END
WHERE category = 'TOTE_BAGS';

-- Update Planners
UPDATE products 
SET theme_tags = CASE
  WHEN name LIKE '%Anime%' THEN ARRAY['anime']
  WHEN name LIKE '%Goal%' OR name LIKE '%Crusher%' THEN ARRAY['motivation']
  WHEN name LIKE '%Aesthetic%' OR name LIKE '%Minimalist%' THEN ARRAY['aesthetic']
  WHEN name LIKE '%Love%' THEN ARRAY['valentine']
  WHEN name LIKE '%Custom%' OR name LIKE '%Personalized%' THEN ARRAY['custom']
  ELSE ARRAY['aesthetic']
END
WHERE category = 'DAILY_PLANNERS';

-- Verify the updates
SELECT name, category, theme_tags 
FROM products 
ORDER BY category, name;

-- Add VIP-related fields to inventory
ALTER TABLE public.inventory 
ADD COLUMN IF NOT EXISTS vip_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS vip_discount_percentage integer DEFAULT 0 CHECK (vip_discount_percentage >= 0 AND vip_discount_percentage <= 100);

-- Update shop_users to use PIN authentication
ALTER TABLE public.shop_users 
ADD COLUMN IF NOT EXISTS pin_hash text,
ADD COLUMN IF NOT EXISTS first_login boolean DEFAULT true;

-- Receipts table to track customer purchases
CREATE TABLE IF NOT EXISTS public.receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  total_price decimal(10, 2) NOT NULL,
  is_paid boolean DEFAULT false,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES public.shop_users(id)
);

-- Receipt items table (individual items in a receipt)
CREATE TABLE IF NOT EXISTS public.receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES public.receipts(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_per_item decimal(10, 2) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_receipts_customer_name ON public.receipts(customer_name);
CREATE INDEX IF NOT EXISTS idx_receipts_created_at ON public.receipts(created_at);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt_id ON public.receipt_items(receipt_id);

-- Update the superadmin to have a default PIN (123123)
-- PIN is hashed using bcrypt (this is the hash for "123123")
UPDATE public.shop_users 
SET pin_hash = '$2a$10$Q8XJ1VZ3JCl.hVkjVBbxB.jZ8ZvKJq9qXs1Z7V3vN8vY4rK0l9n8m',
    first_login = false
WHERE role = 'superadmin' AND pin_hash IS NULL;

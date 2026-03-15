-- Insert superadmin account
-- Password: Nh6hMerljbrGFM8K (hashed with bcrypt)
-- Note: We'll hash this in the application on first run
insert into public.shop_users (email, password_hash, role)
values ('hi@tmrx.lol', '$2b$10$placeholder', 'superadmin')
on conflict (email) do nothing;

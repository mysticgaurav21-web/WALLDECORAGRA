-- WallDecor99 realistic starter data. Run after the initial migration.

insert into public.categories (name, slug, kind, sort_order) values
('Ready Roll Wallpaper','ready-roll-wallpaper','product',1),
('Customized Wallpaper','customized-wallpaper','product',2),
('Living Room','living-room','room',1),
('Bedroom','bedroom','room',2),
('Kids Room','kids-room','room',3),
('Office','office','room',4),
('Pooja Room','pooja-room','room',5),
('Botanical','botanical','style',1),
('Geometric','geometric','style',2),
('Marble','marble','style',3),
('Floral','floral','style',4),
('Spiritual','spiritual','style',5)
on conflict (slug) do update set name = excluded.name, kind = excluded.kind, sort_order = excluded.sort_order;

insert into public.materials (code,name,price_per_sqft,minimum_order_sqft,finish,washability,moisture_resistance,scratch_resistance,durability_rating,expected_life_years,recommended_rooms,installation_method,warranty_text,sample_available) values
('NW','Non-Woven',85,50,'Matte','Light wipe',3,3,4,5,array['Bedroom','Living Room'],'Wallpaper adhesive','One-year manufacturing warranty',true),
('PV','Premium Vinyl',110,50,'Soft satin','Fully washable',5,4,5,7,array['Living Room','Office','Commercial'],'Heavy-duty wallpaper adhesive','Two-year manufacturing warranty',true),
('CT','Canvas Texture',135,50,'Textured matte','Damp wipe',4,4,5,7,array['Feature Wall','Pooja Room','Commercial'],'Premium wallpaper adhesive','Two-year manufacturing warranty',true),
('SA','Self-Adhesive',125,50,'Smooth matte','Light wipe',3,3,4,4,array['Rental','Kids Room','Office'],'Peel and stick','One-year manufacturing warranty',true)
on conflict (code) do update set price_per_sqft=excluded.price_per_sqft, name=excluded.name, is_active=true;

insert into public.products (type,name,slug,sku,short_description,description,material_id,base_price,compare_at_price,roll_width_ft,roll_length_ft,pattern_repeat_in,pattern_name,colour_name,style_names,room_names,washability,durability_rating,care_instructions,warranty_text,installation_available,stock_quantity,status,published_at) values
('ready_roll','Ivory Botanica','ivory-botanica','WD99-BOT-101','Soft botanical linework on warm ivory.','A premium botanical wallpaper for calm bedrooms and living rooms.',(select id from public.materials where code='PV'),2199,2799,1.73,32.8,21,'Botanical','Ivory',array['Luxury','Botanical'],array['Living Room','Bedroom'],'Fully washable',5,'Wipe gently with a soft damp cloth.','Two-year manufacturing warranty',true,28,'active',now()),
('ready_roll','Navy Geometry','navy-geometry','WD99-GEO-204','Structured navy and terracotta geometry.','A modern geometric wallpaper for offices and statement living rooms.',(select id from public.materials where code='NW'),1899,2399,1.73,32.8,20,'Geometric','Navy',array['Modern','Geometric'],array['Office','Living Room'],'Light wipe',4,'Wipe gently with a soft damp cloth.','One-year manufacturing warranty',true,19,'active',now()),
('ready_roll','Marble Noir','marble-noir','WD99-MAR-311','Architectural marble veining.','A luxury marble-inspired wallpaper for reception and feature walls.',(select id from public.materials where code='PV'),2599,3199,1.73,32.8,25,'Marble','Charcoal',array['Luxury','Marble'],array['Living Room','Reception'],'Fully washable',5,'Wipe gently with a soft damp cloth.','Two-year manufacturing warranty',true,11,'active',now()),
('ready_roll','Kids Safari','kids-safari','WD99-KID-612','Playful safari theme for children.','A cheerful washable wallpaper for kids rooms and nurseries.',(select id from public.materials where code='PV'),1799,2199,1.73,32.8,18,'Safari','Pastel',array['Kids','Educational'],array['Kids Room','Nursery'],'Fully washable',5,'Wipe gently with a soft damp cloth.','Two-year manufacturing warranty',true,31,'active',now())
on conflict (sku) do update set base_price=excluded.base_price, compare_at_price=excluded.compare_at_price, stock_quantity=excluded.stock_quantity, status='active';

insert into public.service_areas (postal_code,city,state,delivery_available,installation_available,installation_rate_sqft,base_visit_charge) values
('282001','Agra','Uttar Pradesh',true,true,25,0),
('282002','Agra','Uttar Pradesh',true,true,25,0),
('110001','New Delhi','Delhi',true,false,null,0),
('201301','Noida','Uttar Pradesh',true,false,null,0)
on conflict (postal_code) do update set delivery_available=excluded.delivery_available, installation_available=excluded.installation_available, installation_rate_sqft=excluded.installation_rate_sqft;

insert into public.site_settings (key,value) values
('brand', '{"name":"WallDecor99","currency":"INR","gst_rate":18,"support_city":"Agra"}'::jsonb),
('whatsapp', '{"business_number":"919999999999","enabled":true}'::jsonb),
('pricing', '{"custom_minimum_sqft":50,"installation_default_sqft":25,"delivery_free_above":5000}'::jsonb)
on conflict (key) do update set value=excluded.value, updated_at=now();

insert into public.orders (order_number,guest_email,guest_phone,status,payment_status,shipping_address,pricing_snapshot,subtotal,discount_total,delivery_total,installation_total,tax_total,grand_total,placed_at)
values ('WD-DEMO-001','demo@example.com','+919800000001','in_production','captured','{"full_name":"Demo Customer","city":"Agra","state":"Uttar Pradesh","postal_code":"282001"}'::jsonb,'{"source":"seed","gst_rate":18}'::jsonb,14400,0,700,3000,3258,21358,now())
on conflict (order_number) do nothing;

insert into public.quotations (quotation_number,customer_snapshot,status,pricing_snapshot,subtotal,discount_total,tax_total,grand_total,terms_snapshot,valid_until)
values ('WDQ-DEMO-001','{"name":"Demo Customer","phone":"+919800000001","city":"Agra"}'::jsonb,'sent','{"wall_width_ft":12,"wall_height_ft":10,"material":"Premium Vinyl","gst_rate":18}'::jsonb,18100,0,3258,21358,'50% advance. Production begins after customer proof approval.',current_date + 7)
on conflict (quotation_number) do nothing;

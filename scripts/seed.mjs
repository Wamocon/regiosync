/**
 * Seed script to create test users and mock data for RegioSync.
 * Run with: node scripts/seed.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://enpoccmooqnhbiniqaxt.supabase.co';
const SERVICE_ROLE_KEY = 'NextServiceRoleKeyFromSupabaseDashboard';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_PASSWORD = 'Test1234!';

const users = [
  { email: 'admin@regiosync.de', role: 'super_admin', is_pro: true, full_name: 'Admin User' },
  { email: 'seller1@regiosync.de', role: 'seller', is_pro: false, full_name: 'Hans Mueller' },
  { email: 'seller2@regiosync.de', role: 'seller', is_pro: true, full_name: 'Anna Schmidt' },
  { email: 'user1@regiosync.de', role: 'user', is_pro: false, full_name: 'Max Bauer' },
  { email: 'user2@regiosync.de', role: 'user', is_pro: true, full_name: 'Lisa Weber' },
];

async function seed() {
  console.log('Starting seed...\n');

  const createdUsers = [];

  for (const user of users) {
    console.log(`Creating user: ${user.email} (${user.role}/${user.subscription})`);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: TEST_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: user.full_name }
    });

    if (authError) {
      if (authError.message.includes('already been registered')) {
        console.log(`  -> Already exists, fetching...`);
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existing = listData?.users?.find(u => u.email === user.email);
        if (existing) {
          createdUsers.push({ ...user, id: existing.id });
          // Update profile
          await supabase.from('profiles').upsert({
            id: existing.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            is_pro: user.is_pro,
          });
        }
      } else {
        console.error(`  -> Error: ${authError.message}`);
      }
      continue;
    }

    const userId = authData.user.id;
    createdUsers.push({ ...user, id: userId });

    // Update profile with role and subscription
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      is_pro: user.is_pro,
    });

    if (profileError) {
      console.error(`  -> Profile error: ${profileError.message}`);
    } else {
      console.log(`  -> Created successfully (ID: ${userId})`);
    }
  }

  console.log('\n--- Creating shops and products ---\n');

  const seller1 = createdUsers.find(u => u.email === 'seller1@regiosync.de');
  const seller2 = createdUsers.find(u => u.email === 'seller2@regiosync.de');

  if (seller1) {
    // Seller 1 shops (free - limited)
    const { data: shop1 } = await supabase.from('shops').insert({
      owner_id: seller1.id,
      name: 'Bauernhof Mueller',
      description: 'Frische Produkte direkt vom Bauernhof. Obst, Gemuese und Eier aus eigener Produktion.',
      address: 'Hauptstrasse 12, 78532 Tuttlingen',
      city: 'Tuttlingen',
      country: 'Germany',
      latitude: 47.98,
      longitude: 8.82,
      is_active: true,
    }).select().single();

    if (shop1) {
      console.log(`Created shop: ${shop1.name}`);
      // Products for shop1
      const products1 = [
        { shop_id: shop1.id, name: 'Bio-Eier (10 Stueck)', description: 'Freilandhaltung, taeglich frisch', price: 4.50, category: 'dairy', is_available: true },
        { shop_id: shop1.id, name: 'Kartoffeln (2kg)', description: 'Festkochend, ideal fuer Salat', price: 3.20, category: 'vegetables', is_available: true },
        { shop_id: shop1.id, name: 'Aepfel Elstar (1kg)', description: 'Saftig und suesssauerlich', price: 2.80, category: 'fruits', is_available: true },
        { shop_id: shop1.id, name: 'Honig (500g)', description: 'Regionaler Bluetenhonig', price: 8.50, category: 'other', is_available: false },
      ];
      for (const p of products1) {
        await supabase.from('products').insert(p);
      }
      console.log(`  -> Added ${products1.length} products`);
    }
  }

  if (seller2) {
    // Seller 2 shops (pro - multiple)
    const shops2 = [
      { owner_id: seller2.id, name: 'Schmidts Hofladen', description: 'Kaese, Milch und Joghurt aus eigener Herstellung. Alles Bio!', address: 'Dorfstrasse 5, 78532 Tuttlingen', city: 'Tuttlingen', country: 'Germany', latitude: 47.97, longitude: 8.81, is_active: true },
      { owner_id: seller2.id, name: 'Schmidts Marktstand', description: 'Jeden Samstag auf dem Wochenmarkt mit frischem Brot und Gebaeck.', address: 'Marktplatz 1, 78532 Tuttlingen', city: 'Tuttlingen', country: 'Germany', latitude: 47.98, longitude: 8.83, is_active: true },
    ];

    for (const shopData of shops2) {
      const { data: shop } = await supabase.from('shops').insert(shopData).select().single();
      if (shop) {
        console.log(`Created shop: ${shop.name}`);
        if (shop.name === 'Schmidts Hofladen') {
          const products = [
            { shop_id: shop.id, name: 'Bio-Kaese (200g)', description: 'Hausgemachter Bergkaese, 6 Monate gereift', price: 6.90, category: 'dairy', is_available: true },
            { shop_id: shop.id, name: 'Frischmilch (1L)', description: 'Tagesfrisch von der eigenen Kuh', price: 1.80, category: 'dairy', is_available: true },
            { shop_id: shop.id, name: 'Naturjoghurt (500g)', description: 'Cremig und mild', price: 2.50, category: 'dairy', is_available: true },
            { shop_id: shop.id, name: 'Butter (250g)', description: 'Handgeruehrte Landbutter', price: 3.40, category: 'dairy', is_available: true },
            { shop_id: shop.id, name: 'Ziegenkaese (150g)', description: 'Mild und cremig', price: 5.20, category: 'dairy', is_available: false },
          ];
          for (const p of products) {
            await supabase.from('products').insert(p);
          }
          console.log(`  -> Added ${products.length} products`);
        } else {
          const products = [
            { shop_id: shop.id, name: 'Bauernbrot (750g)', description: 'Sauerteig, traditionell gebacken', price: 4.20, category: 'bakery', is_available: true },
            { shop_id: shop.id, name: 'Dinkelbroetchen (4 St.)', description: 'Knusprig und vollwertig', price: 3.60, category: 'bakery', is_available: true },
            { shop_id: shop.id, name: 'Apfelkuchen', description: 'Nach Omas Rezept', price: 12.00, category: 'bakery', is_available: true },
          ];
          for (const p of products) {
            await supabase.from('products').insert(p);
          }
          console.log(`  -> Added ${products.length} products`);
        }
      }
    }
  }

  // Add some reviews
  console.log('\n--- Creating reviews ---\n');
  const user1 = createdUsers.find(u => u.email === 'user1@regiosync.de');
  const user2 = createdUsers.find(u => u.email === 'user2@regiosync.de');

  const { data: allShops } = await supabase.from('shops').select('id, name');
  if (allShops && user1 && user2) {
    for (const shop of allShops) {
      await supabase.from('reviews').insert({
        shop_id: shop.id,
        user_id: user1.id,
        rating: 4,
        comment: 'Sehr gute Qualitaet und freundlicher Service!',
      });
      await supabase.from('reviews').insert({
        shop_id: shop.id,
        user_id: user2.id,
        rating: 5,
        comment: 'Absolut empfehlenswert! Frische Produkte und faire Preise.',
      });
    }
    console.log(`Added reviews for ${allShops.length} shops`);
  }

  // Add notifications
  console.log('\n--- Creating notifications ---\n');
  if (seller1) {
    await supabase.from('notifications').insert([
      { user_id: seller1.id, title: 'Neue Produktanfrage', message: 'Ein Kunde hat Bio-Tomaten angefragt.', type: 'product_request', is_read: false },
      { user_id: seller1.id, title: 'Neue Bewertung', message: 'Ihr Laden hat eine 5-Sterne Bewertung erhalten!', type: 'review', is_read: true },
    ]);
  }
  if (user1) {
    await supabase.from('notifications').insert([
      { user_id: user1.id, title: 'Willkommen bei RegioSync!', message: 'Entdecke lokale Produkte in deiner Naehe.', type: 'system', is_read: false },
    ]);
  }
  if (user2) {
    await supabase.from('notifications').insert([
      { user_id: user2.id, title: 'Pro-Upgrade aktiv', message: 'Dein Pro-Abo ist jetzt aktiv. Geniesse unbegrenzten Zugang!', type: 'system', is_read: false },
      { user_id: user2.id, title: 'Neues Angebot', message: 'Schmidts Hofladen hat ein neues Produkt hinzugefuegt.', type: 'new_product', is_read: false },
    ]);
  }
  console.log('Added notifications');

  console.log('\n=== Seed complete! ===\n');
  console.log('Test Users:');
  console.log('---');
  for (const u of users) {
    console.log(`  ${u.email} | Password: ${TEST_PASSWORD} | Role: ${u.role} | Plan: ${u.is_pro ? 'Pro' : 'Free'}`);
  }
}

seed().catch(console.error);

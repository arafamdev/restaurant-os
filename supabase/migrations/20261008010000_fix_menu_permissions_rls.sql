-- ============================================================
-- Corrige as permissões RLS do Menu e Daily Menu.
--
-- view_menu:
-- Permite consultar o menu da própria restauração.
--
-- manage_menu:
-- Permite criar, alterar e apagar dados do menu.
--
-- Platform Admin:
-- Tem acesso total através do bypass existente.
-- ============================================================


-- ============================================================
-- MENU CATEGORIES
-- ============================================================

drop policy if exists "menu_categories_select_policy"
on public.menu_categories;

create policy "menu_categories_select_policy"
on public.menu_categories
for select
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('view_menu')
  )
);


drop policy if exists "menu_categories_insert_policy"
on public.menu_categories;

create policy "menu_categories_insert_policy"
on public.menu_categories
for insert
to authenticated
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "menu_categories_update_policy"
on public.menu_categories;

create policy "menu_categories_update_policy"
on public.menu_categories
for update
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
)
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "menu_categories_delete_policy"
on public.menu_categories;

create policy "menu_categories_delete_policy"
on public.menu_categories
for delete
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


-- ============================================================
-- MENU ITEMS
-- ============================================================

drop policy if exists "menu_items_select_policy"
on public.menu_items;

create policy "menu_items_select_policy"
on public.menu_items
for select
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('view_menu')
  )
);


drop policy if exists "menu_items_insert_policy"
on public.menu_items;

create policy "menu_items_insert_policy"
on public.menu_items
for insert
to authenticated
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "menu_items_update_policy"
on public.menu_items;

create policy "menu_items_update_policy"
on public.menu_items
for update
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
)
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "menu_items_delete_policy"
on public.menu_items;

create policy "menu_items_delete_policy"
on public.menu_items
for delete
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


-- ============================================================
-- DAILY MENUS
-- ============================================================

drop policy if exists "Users can view daily menus in their restaurant"
on public.daily_menus;

create policy "Users can view daily menus in their restaurant"
on public.daily_menus
for select
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('view_menu')
  )
);


drop policy if exists "Users can create daily menus in their restaurant"
on public.daily_menus;

create policy "Users can create daily menus in their restaurant"
on public.daily_menus
for insert
to authenticated
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "Users can update daily menus in their restaurant"
on public.daily_menus;

create policy "Users can update daily menus in their restaurant"
on public.daily_menus
for update
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
)
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "Users can delete daily menus in their restaurant"
on public.daily_menus;

create policy "Users can delete daily menus in their restaurant"
on public.daily_menus
for delete
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


-- ============================================================
-- DAILY MENU OPTIONS
-- ============================================================

drop policy if exists "Users can view daily menu options in their restaurant"
on public.daily_menu_options;

create policy "Users can view daily menu options in their restaurant"
on public.daily_menu_options
for select
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('view_menu')
  )
);


drop policy if exists "Users can create daily menu options in their restaurant"
on public.daily_menu_options;

create policy "Users can create daily menu options in their restaurant"
on public.daily_menu_options
for insert
to authenticated
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "Users can update daily menu options in their restaurant"
on public.daily_menu_options;

create policy "Users can update daily menu options in their restaurant"
on public.daily_menu_options
for update
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
)
with check (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);


drop policy if exists "Users can delete daily menu options in their restaurant"
on public.daily_menu_options;

create policy "Users can delete daily menu options in their restaurant"
on public.daily_menu_options
for delete
to authenticated
using (
  is_current_user_platform_admin()
  or (
    restaurant_id = get_current_user_restaurant_id()
    and has_permission('manage_menu')
  )
);

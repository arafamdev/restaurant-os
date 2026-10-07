-- Permissões são um catálogo global usado pela aplicação.
-- Utilizadores autenticados podem consultar as permissões disponíveis.

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "permissions_select_authenticated"
ON public.permissions;

CREATE POLICY "permissions_select_authenticated"
ON public.permissions
FOR SELECT
TO authenticated
USING (true);

REVOKE ALL ON TABLE public.permissions FROM anon;
GRANT SELECT ON TABLE public.permissions TO authenticated;
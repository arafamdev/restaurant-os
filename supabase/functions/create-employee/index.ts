import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    { auth: "user" },
    async (req, ctx) => {
      const userId = ctx.userClaims?.id;

      if (!userId) {
        return Response.json(
          {
            message: "Authenticated user not found.",
          },
          { status: 401 },
        );
      }

      let body;

      try {
        body = await req.json();
      } catch {
        return Response.json(
          {
            message: "Invalid JSON body.",
          },
          { status: 400 },
        );
      }

      const {
        email,
        full_name,
        phone,
        role_id,
        restaurant_id,
      } = body;

      if (
        !email ||
        !full_name ||
        !role_id ||
        !restaurant_id
      ) {
        return Response.json(
          {
            message:
              "email, full_name, role_id and restaurant_id are required.",
          },
          { status: 400 },
        );
      }

      const restaurantId = Number(restaurant_id);
      const roleId = Number(role_id);

      if (!Number.isInteger(restaurantId) || restaurantId <= 0) {
        return Response.json(
          {
            message: "A valid restaurant_id is required.",
          },
          { status: 400 },
        );
      }

      if (!Number.isInteger(roleId) || roleId <= 0) {
        return Response.json(
          {
            message: "A valid role_id is required.",
          },
          { status: 400 },
        );
      }

      /*
       * ---------------------------------------------------------
       * 1. Verify authorization
       * ---------------------------------------------------------
       */

      const { data: platformAdmin, error: platformAdminError } =
        await ctx.supabaseAdmin
          .from("platform_admins")
          .select("user_id")
          .eq("user_id", userId)
          .maybeSingle();

      if (platformAdminError) {
        console.error(
          "Platform Admin authorization error:",
          platformAdminError,
        );

        return Response.json(
          {
            message: "Unable to verify authorization.",
          },
          { status: 500 },
        );
      }

      let authorization:
        | "platform_admin"
        | "restaurant_manager";

      if (platformAdmin) {
        authorization = "platform_admin";
      } else {
        /*
         * -------------------------------------------------------
         * 2. Verify Restaurant Manager
         * -------------------------------------------------------
         */

        const { data: employee, error: employeeError } =
          await ctx.supabaseAdmin
            .from("employees")
            .select("id, role_id")
            .eq("user_id", userId)
            .eq("restaurant_id", restaurantId)
            .eq("status", "active")
            .maybeSingle();

        if (employeeError) {
          console.error(
            "Employee authorization error:",
            employeeError,
          );

          return Response.json(
            {
              message: "Unable to verify authorization.",
            },
            { status: 500 },
          );
        }

        if (!employee) {
          return Response.json(
            {
              message:
                "You are not an active employee of this restaurant.",
            },
            { status: 403 },
          );
        }

        const { data: role, error: roleError } =
          await ctx.supabaseAdmin
            .from("roles")
            .select("id, name")
            .eq("id", employee.role_id)
            .maybeSingle();

        if (roleError) {
          console.error(
            "Role authorization error:",
            roleError,
          );

          return Response.json(
            {
              message: "Unable to verify authorization.",
            },
            { status: 500 },
          );
        }

        if (role?.name !== "manager") {
          return Response.json(
            {
              message:
                "Only a restaurant manager or Platform Admin can create employees.",
            },
            { status: 403 },
          );
        }

        authorization = "restaurant_manager";
      }

      /*
       * ---------------------------------------------------------
       * 3. Verify new employee role
       * ---------------------------------------------------------
       */

      const {
        data: newEmployeeRole,
        error: newEmployeeRoleError,
      } = await ctx.supabaseAdmin
        .from("roles")
        .select("id, name")
        .eq("id", roleId)
        .maybeSingle();

      if (newEmployeeRoleError) {
        console.error(
          "New employee role lookup error:",
          newEmployeeRoleError,
        );

        return Response.json(
          {
            message: "Unable to verify employee role.",
          },
          { status: 500 },
        );
      }

      if (!newEmployeeRole) {
        return Response.json(
          {
            message: "The selected role does not exist.",
          },
          { status: 400 },
        );
      }

      /*
       * ---------------------------------------------------------
       * 4. Invite user through Supabase Auth
       * ---------------------------------------------------------
       */

      const {
        data: invitedUser,
        error: inviteUserError,
      } =
        await ctx.supabaseAdmin.auth.admin.inviteUserByEmail(
          email,
          {
            data: {
              full_name,
            },
            redirectTo:
              "http://localhost:5173/auth/accept-invite",
          },
        );

      if (inviteUserError) {
  console.error(
    "Supabase Auth invitation error:",
    inviteUserError,
  );

  return Response.json(
    {
      message: "Unable to send employee invitation.",
      error: inviteUserError.message,
      code: inviteUserError.code ?? null,
      status: inviteUserError.status ?? null,
    },
    { status: 400 },
  );
}

      if (!invitedUser.user) {
        return Response.json(
          {
            message:
              "Unable to create invited authentication user.",
          },
          { status: 500 },
        );
      }

      const newUserId = invitedUser.user.id;

      /*
       * ---------------------------------------------------------
       * 5. Create employee record
       * ---------------------------------------------------------
       */

      const {
        data: newEmployee,
        error: createEmployeeError,
      } = await ctx.supabaseAdmin
        .from("employees")
        .insert({
          user_id: newUserId,
          full_name,
          phone: phone || null,
          role_id: roleId,
          status: "active",
          restaurant_id: restaurantId,
        })
        .select(
          "id, user_id, full_name, phone, role_id, status, restaurant_id, created_at",
        )
        .single();

      /*
       * ---------------------------------------------------------
       * 6. Rollback Auth user if employee creation fails
       * ---------------------------------------------------------
       */

      if (createEmployeeError) {
        console.error(
          "Employee creation error:",
          createEmployeeError,
        );

        const { error: deleteUserError } =
          await ctx.supabaseAdmin.auth.admin.deleteUser(
            newUserId,
          );

        if (deleteUserError) {
          console.error(
            "Unable to rollback Auth user:",
            deleteUserError,
          );
        }

        return Response.json(
          {
            message: "Unable to create employee.",
            error: createEmployeeError.message,
          },
          { status: 500 },
        );
      }

      /*
       * ---------------------------------------------------------
       * 7. Success
       * ---------------------------------------------------------
       */

      return Response.json({
        success: true,
        authorized: true,
        authorization,
        employee: newEmployee,
      });
    },
  ),
};
from django.contrib import admin

import auth_users.models


@admin.register(auth_users.models.User)
class UserAdmin(admin.ModelAdmin):
    filter_horizontal = (auth_users.models.User.games.field.name,)



@admin.register(auth_users.models.Admins)
class AdminsAdmin(admin.ModelAdmin):
    pass

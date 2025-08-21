
# users/models.py

from django.db import models

class NextAuthUser(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    name = models.CharField(max_length=255)

    class Meta:
        db_table = '"User"'   # 👈 important: match exact Postgres table name
        managed = False       # Django will not try to create/drop this table

    def __str__(self):
        return self.email

from django.db import models
from django.contrib.auth.models import User

class Subscription(models.Model):
    stripe_subscription_id = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # サブスクリプションに関連するユーザー
    status = models.CharField(max_length=50, default='pending')  # サブスクリプションの状態
    created_at = models.DateTimeField(auto_now_add=True)  # サブスクリプションが作成された日時
    updated_at = models.DateTimeField(auto_now=True)  # サブスクリプションが最後に更新された日時

    def __str__(self):
        return f"Subscription {self.stripe_subscription_id} - {self.status}"

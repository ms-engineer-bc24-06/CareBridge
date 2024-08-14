from rest_framework.decorators import api_view
from rest_framework.response import Response
import uuid

# ベタ打ちの連絡事項データ
CONTACT_NOTES = [
    {
        "id": 1,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-01",
        "detail": "必要備品に関してのご連絡です。新しい備品が必要になるため、次回のご来訪時にご確認ください。詳細はスタッフまでお問い合わせください。",
        "staff": 201,
        "status": "未確認"  # 新しく追加したステータス
    },
    {
        "id": 2,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-02",
        "detail": "定期健康診断の結果が出ました。結果についての詳細は、次回の面談時にお知らせします。何かご質問がございましたら、事前にお問い合わせください。",
        "staff": 202,
        "status": "確認済み"
    },
    {
        "id": 3,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-03",
        "detail": "薬の処方が変更されました。変更された薬のリストは、ご来訪時にお渡しします。また、何か不明な点がございましたらスタッフにお尋ねください。",
        "staff": 203,
        "status": "未確認"
    },
    {
        "id": 4,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-04",
        "detail": "緊急連絡先の変更がありました。新しい連絡先については、次回の訪問時に確認をお願いいたします。詳細はスタッフまでご連絡ください。",
        "staff": 204,
        "status": "確認済み"
    },
    {
        "id": 5,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-05",
        "detail": "定期健康診断の結果が出ました。結果についての詳細は、次回の面談時にお知らせします。何かご質問がございましたら、事前にお問い合わせください。",
        "staff": 202,
        "status": "確認済み"
    },
    {
        "id": 6,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-06",
        "detail": "薬の処方が変更されました。変更された薬のリストは、ご来訪時にお渡しします。また、何か不明な点がございましたらスタッフにお尋ねください。",
        "staff": 203,
        "status": "未確認"
    },
    {
        "id": 7,
        "user": "b61da427-3ad3-4c41-b268-00a2837cd4b9",
        "date": "2024-08-07",
        "detail": "緊急連絡先の変更がありました。新しい連絡先については、次回の訪問時に確認をお願いいたします。詳細はスタッフまでご連絡ください。",
        "staff": 204,
        "status": "確認済み"
    }
]

@api_view(['GET'])
def get_contact_notes(request):
    return Response(CONTACT_NOTES)

@api_view(['GET'])
def get_user_contact_notes(request, uuid):
    user_contact_notes = [note for note in CONTACT_NOTES if note['user'] == str(uuid)]
    if user_contact_notes:
        return Response(user_contact_notes)
    return Response({"message": "連絡事項が見つかりません"}, status=404)

@api_view(['GET'])
def get_contact_note_by_id(request, id):
    note = next((note for note in CONTACT_NOTES if note['id'] == id), None)
    if note:
        return Response(note)
    return Response({"message": "連絡事項が見つかりません"}, status=404)

@api_view(['PATCH'])
def update_contact_note_status(request, id):
    note = next((note for note in CONTACT_NOTES if note['id'] == id), None)
    if note:
        note['status'] = "確認済み"  # ステータスを確認済みに変更
        return Response(note)
    return Response({"message": "連絡事項が見つかりません"}, status=404)

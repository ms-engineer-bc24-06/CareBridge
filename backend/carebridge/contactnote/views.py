from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from carebridge.models import ContactNote, User, Staff
from .serializers import ContactNoteSerializer

@api_view(['GET'])
def get_contact_notes_by_user(request, uuid):
    contact_notes = ContactNote.objects.filter(user__uuid=uuid)
    serializer = ContactNoteSerializer(contact_notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_contact_note_detail(request, id):
    try:
        contact_note = ContactNote.objects.get(id=id)
        serializer = ContactNoteSerializer(contact_note)
        return Response(serializer.data)
    except ContactNote.DoesNotExist:
        return Response({"コンタクトノートが見つかりません"}, status=404)

@api_view(['POST'])
def create_contact_note(request):
    try:
        # user_uuidを取得
        user = User.objects.get(uuid=request.data.get('user'))
        
        # staff_idを取得
        staff = Staff.objects.get(staff_id=request.data.get('staff'))
        
        # 新しいContactNoteオブジェクトを作成
        contact_note = ContactNote(
            user=user,
            date=request.data.get('date'),
            detail=request.data.get('detail'),
            staff=staff,
            is_confirmed=False  # 新規登録時は未確認に設定
        )
        contact_note.save()

        serializer = ContactNoteSerializer(contact_note)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except User.DoesNotExist:
        return Response({"error": "指定されたユーザーが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Staff.DoesNotExist:
        return Response({"error": "指定されたスタッフが見つかりません"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # 予期しないエラーが発生した場合にエラー内容を返す
        return Response({"error": f"リクエストが不正です: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def update_contact_note(request, id):
    try:
        contact_note = ContactNote.objects.get(id=id)
        serializer = ContactNoteSerializer(contact_note, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors)  # エラーをログに出力
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except ContactNote.DoesNotExist:
        return Response({"error": "Contact note not found"}, status=status.HTTP_404_NOT_FOUND)
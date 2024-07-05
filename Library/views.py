from django.shortcuts import render , redirect , get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib import messages
from .models import Books
from .models import User

# Home
def Home(request):
    return render(request, 'Pages/Home.html' )

def SignUp(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        confirmPassword = request.POST.get('confirmpassword')
        email = request.POST.get('email')
        user_type = request.POST.get('userType')
        if password != confirmPassword:
            messages.error(request, "Passwords do not match")
            return render(request, 'Pages/signup.html')

        if user_type == 'admin':            
            new_user = User.objects.create(
                username=username,
                password=password,
                confirmPassword=confirmPassword,
                email=email,
                is_admin = True
            )
            new_user.save()

            return redirect('AdminBooks')  
        else:
            new_user = User.objects.create(
                username=username,
                password=password,
                confirmPassword=confirmPassword,
                email=email,
                is_admin = False
            )
            new_user.save()
            return redirect('UserBooks')
    return render(request, 'Pages/signup.html' )

def Login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user_exists = False
        for user in User.objects.all():
            if user.username == username:
                user_exists = True
                if user.password == password:
                    data = User(username=username,password=password,email=user.email,is_admin=user.is_admin)
                    if user.is_admin:
                        return redirect('AdminBooks')  
                    else:
                        return redirect('UserBooks')  
                else:
                    messages.error(request, "Invalid password")
                    break
        if not user_exists:
            messages.error(request, "User does not exist. Sign up first.")
    return render(request, 'Pages/login.html')

# Admin Attributes

def AdminBooks(request):
    books = Books.objects.all()
    return render(request, 'Pages/ViewBooks_Admin.html', {'books': books})

def AddBooks(request):
    if request.method == 'POST':
        book_name = request.POST.get('bookName')
        author = request.POST.get('author')
        category = request.POST.get('category')
        description = request.POST.get('description')
        image = request.FILES.get('image')
        status = request.POST.get('status')  
        #Check for Me
        print(f"Received: {book_name}, {author}, {category}, {description}, {image}, {status}")
        
        book = Books.objects.create(
            name=book_name,
            author=author,
            category=category,
            description=description,
            image=image,
            status=status
        )
        book.save()
        
        messages.success(request, 'Book added successfully!')
        return redirect('AddBooks')
    return render(request, 'Pages/AddBook.html' )

def ShowBooks(request):
    books = Books.objects.all()
    return render(request, 'Pages/Details.html', {'books': books} )

def DeleteBooks(request):
    if request.method == 'POST':
        book_id = request.POST.get('book_id')
        book = get_object_or_404(Books, pk=book_id)
        book.delete()
        return JsonResponse({'message': 'Book deleted successfully'})
    else:
        bookes = Books.objects.all()
        return render(request, 'Pages/DeleteBook.html', {'bookes': bookes} )

def EditBooks(request):
    if request.method == 'GET':
        if 'book_id' in request.GET:
            book_id = request.GET.get('book_id')
            book = get_object_or_404(Books, pk=book_id)
            book_data = {
                'id': book.id,
                'name': book.name,
                'author': book.author,
                'description': book.description,
                'category': book.category,
                'status': book.status,
            }
            return JsonResponse(book_data)
        else:
            return render(request, 'Pages/SelectANDEdit.html')
    elif request.method == 'POST':
        book_id = request.POST.get('selectbyid')
        book = get_object_or_404(Books, pk=book_id)
        book.name = request.POST.get('bookName')
        book.author = request.POST.get('author')
        book.description = request.POST.get('description')
        book.category = request.POST.get('category')
        book.status = request.POST.get('status')
        if 'image' in request.FILES:
            book.image = request.FILES['image']
        book.save()
    return render(request, 'Pages/SelectANDEdit.html')

# User Attributes
def UserBooks(request):
    if request.method == 'POST' and 'book_id' in request.POST:
        book_id = request.POST.get('book_id')
        book = get_object_or_404(Books, pk=book_id)
        book.status = 'Not In Library'  
        book.save()
        return JsonResponse({'message': 'Book Marked successfully'})
    else:
        mark_books = Books.objects.filter(status='Marked')
        return render(request, 'Pages/ViewBook_User.html', {'mark_books': mark_books} )

def Borrow(request):
    if request.method == 'POST' and 'book_id' in request.POST:
        book_id = request.POST.get('book_id')
        book = get_object_or_404(Books, pk=book_id)
        book.status = 'Borrowed'  # Assuming 'Borrow' is the correct status
        book.save()
        return JsonResponse({'message': 'Book Borrowed successfully'})
    else:
        borrow_books = Books.objects.filter(status='Borrow')
        return render(request, 'Pages/Borrow.html', {'borrow_books': borrow_books})

def BorrowedBooks(request):
    if request.method == 'POST' and 'book_id' in request.POST:
        book_id = request.POST.get('book_id')
        book = get_object_or_404(Books, pk=book_id)
        book.status = 'Borrow' 
        book.save()
        return JsonResponse({'message': 'Book returned successfully'})
    else:
        borrowed_books = Books.objects.filter(status='Borrowed')
        return render(request, 'Pages/BorrowedBooks.html', {'borrowed_books': borrowed_books})

def SearchBooks(request):
    if request.method == 'POST':
        search_query = request.POST.get('searchQuery', None)
        category = request.POST.get('category', None)       
        if search_query:
            books = Books.objects.filter(name__icontains=search_query) | Books.objects.filter(author__icontains=search_query)
        elif category:
            books = Books.objects.filter(category=category)
        else:
            books = Books.objects.all()
    else:
        books = Books.objects.all()
    return render(request, 'Pages/Search.html', {'books': books})

def MarkBook(request):
    if request.method == 'POST' and 'book_id' in request.POST:
        book_id = request.POST.get('book_id')
        book = get_object_or_404(Books, pk=book_id)
        book.status = 'Marked'  
        book.save()
        return JsonResponse({'message': 'Book Marked successfully'})
    else:
        mark_books = Books.objects.filter(status='Not In Library')
        return render(request, 'Pages/MarkBook.html',{'mark_books':mark_books})


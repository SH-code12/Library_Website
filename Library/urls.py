from django.urls import path
from . import views

urlpatterns = [
    #Test
    # path('Index/',views.index, name = 'index'),
    #Home
    path('',views.Home, name = 'Home'),
    #Signup and login
    path('SignUp/',views.SignUp, name = 'SignUp'),
    path('Login/',views.Login, name = 'Login'),
    #Admin
    path('AdminBooks/',views.AdminBooks, name = 'AdminBooks'),
    path('AddBooks/',views.AddBooks, name = 'AddBooks'),
    path('ShowBooks/',views.ShowBooks, name = 'ShowBooks'),
    path('DeleteBooks/',views.DeleteBooks, name = 'DeleteBooks'),
    path('EditBooks/',views.EditBooks, name = 'EditBooks'),
    # User
    path('UserBooks/',views.UserBooks, name = 'UserBooks'),
    path('Borrow/',views.Borrow, name = 'Borrow'),
    path('BorrowedBooks/',views.BorrowedBooks, name = 'BorrowedBooks'),
    path('SearchBooks/',views.SearchBooks, name = 'SearchBooks'), 
    path('MarkBook/',views.MarkBook, name = 'MarkBook'),

]

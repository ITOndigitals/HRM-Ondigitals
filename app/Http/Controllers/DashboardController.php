<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\RequestTemplate;
use App\Models\User;
use App\Models\UserRequests;
use App\Models\UserRequestsApprover;
use App\Models\InputDetailRequest;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $userRequests = UserRequests::where('id_user', $userId)
            ->join('request_templates', 'user_requests.request_template', '=', 'request_templates.id')
            ->select('user_requests.*', 'request_templates.template_name')
            ->get();

        $userList = User::pluck('name', 'id')->all();
        $allTemplate = RequestTemplate::all();
        $inputDetailRequests = InputDetailRequest::pluck('input_description', 'input_name')->all();
        $memberUser = User::where('direct_manager', $userId)->get();
        // Get requests for the members of the current user
        $memberUserIds = $memberUser->pluck('id')->toArray();
        $needApprove = UserRequests::whereIn('id_user', $memberUserIds)
            ->where('status', 0)
            ->where('fully_accept', '<>', 1)
            ->where('fully_accept', '<>', 2)
            ->join('users', 'users.id', '=', 'user_requests.id_user')
            ->join('request_templates', 'user_requests.request_template', '=', 'request_templates.id')
            ->select('user_requests.*', 'request_templates.template_name','users.name as user_name')
            ->get();

        return Inertia::render('Dashboard', compact('allTemplate', 'userRequests', 'needApprove', 'inputDetailRequests', 'userList'));
    }

}

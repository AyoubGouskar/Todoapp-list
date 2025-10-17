<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $result = $this->authService->register($request->all());

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message'],
                'errors' => $result['errors'] ?? null
            ], 400);
        }

        return response()->json([
            'message' => $result['message'],
            'user' => $result['user'],
            'token' => $result['token']
        ], 201);
    }

    /**
     * Login user and return token
     */
    public function login(Request $request)
    {
        $result = $this->authService->login($request->only('email', 'password'));

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message'],
                'errors' => $result['errors'] ?? null
            ], 401);
        }

        return response()->json([
            'message' => $result['message'],
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me()
    {
        $user = $this->authService->getAuthenticatedUser();
        
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        return response()->json(['user' => $user]);
    }

    /**
     * Refresh JWT token
     */
    public function refresh()
    {
        $result = $this->authService->refreshToken();

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 401);
        }

        return response()->json([
            'message' => $result['message'],
            'token' => $result['token']
        ]);
    }

    /**
     * Logout user
     */
    public function logout()
    {
        $result = $this->authService->logout();

        if (!$result['success']) {
            return response()->json([
                'message' => $result['message']
            ], 500);
        }

        return response()->json([
            'message' => $result['message']
        ]);
    }
}

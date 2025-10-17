<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Register a new user
     */
    public function register(array $data): array
    {
        // Validate the registration data
        $validator = Validator::make($data, [
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ];
        }

        // Check if email already exists
        if ($this->userRepository->emailExists($data['email'])) {
            return [
                'success' => false,
                'message' => 'Email already exists',
                'errors' => ['email' => ['The email has already been taken.']]
            ];
        }

        // Handle image upload
        $imagePath = null;
        if (isset($data['image']) && $data['image']->isValid()) {
            $imagePath = $data['image']->store('profile-images', 'public');
        }

        // Create user
        $userData = [
            'full_name' => $data['full_name'],
            'name' => $data['full_name'], // For compatibility
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'image' => $imagePath,
            'password' => Hash::make($data['password']),
        ];

        $user = $this->userRepository->create($userData);

        // Generate JWT token
        $token = JWTAuth::fromUser($user);

        return [
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Login user
     */
    public function login(array $credentials): array
    {
        // Validate login credentials
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return [
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ];
        }

        // Attempt to authenticate
        if (!$token = JWTAuth::attempt($credentials)) {
            return [
                'success' => false,
                'message' => 'Invalid credentials',
                'errors' => ['email' => ['These credentials do not match our records.']]
            ];
        }

        $user = auth()->user();

        return [
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user
        ];
    }

    /**
     * Get authenticated user
     */
    public function getAuthenticatedUser(): ?User
    {
        return auth()->user();
    }

    /**
     * Refresh JWT token
     */
    public function refreshToken(): array
    {
        try {
            $token = JWTAuth::refresh();
            return [
                'success' => true,
                'token' => $token,
                'message' => 'Token refreshed successfully'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Token refresh failed',
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Logout user
     */
    public function logout(): array
    {
        try {
            JWTAuth::invalidate();
            return [
                'success' => true,
                'message' => 'Logout successful'
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ];
        }
    }
}

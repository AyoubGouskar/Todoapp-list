<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
          Schema::table('users', function (Blueprint $table) {
        $table->string('full_name')->after('id');
        $table->string('phone')->nullable()->after('email');
        $table->string('address')->nullable()->after('phone');
        $table->string('image')->nullable()->after('address');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['full_name', 'phone', 'address', 'image']);
    });
    }
};

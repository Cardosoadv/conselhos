<script setup>

</script>

<template>

<main role="main" class="container">
        
    <div class="container d-flex justify-content-center p-5">
        <div class="card col-12 col-md-5 shadow-sm">
            <div class="card-body">
                <h5 class="card-title mb-5">Register</h5>

                
                <form action="http://localhost/conselhos/register" method="post">
                    <input type="hidden" name="csrf_test_name" value="00a13f9040173d1ad0092d306e8cca00">
                    <!-- Email -->
                    <div class="form-floating mb-2">
                        <input type="email" class="form-control" id="floatingEmailInput" name="email" inputmode="email" autocomplete="email" placeholder="Email Address" value="" required />
                        <label for="floatingEmailInput">Email Address</label>
                    </div>

                    <!-- Username -->
                    <div class="form-floating mb-4">
                        <input type="text" class="form-control" id="floatingUsernameInput" name="username" inputmode="text" autocomplete="username" placeholder="Username" value="" required />
                        <label for="floatingUsernameInput">Username</label>
                    </div>

                    <!-- Password -->
                    <div class="form-floating mb-2">
                        <input type="password" class="form-control" id="floatingPasswordInput" name="password" inputmode="text" autocomplete="new-password" placeholder="Password" required />
                        <label for="floatingPasswordInput">Password</label>
                    </div>

                    <!-- Password (Again) -->
                    <div class="form-floating mb-5">
                        <input type="password" class="form-control" id="floatingPasswordConfirmInput" name="password_confirm" inputmode="text" autocomplete="new-password" placeholder="Password (again)" required />
                        <label for="floatingPasswordConfirmInput">Password (again)</label>
                    </div>

                    <div class="d-grid col-12 col-md-8 mx-auto m-3">
                        <button type="submit" class="btn btn-primary btn-block">Register</button>
                    </div>

                    <p class="text-center">Already have an account? <a href="http://localhost/conselhos/login">Login</a></p>

                </form>
            </div>
        </div>
    </div>

    </main>
</template>    
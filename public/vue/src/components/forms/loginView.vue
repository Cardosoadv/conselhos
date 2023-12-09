<script setup>

</script>

<template>
    


<main role="main" class="container">
        
    <div class="container d-flex justify-content-center p-5">
        <div class="card col-12 col-md-5 shadow-sm">
            <div class="card-body">
                <h5 class="card-title mb-5">Login</h5>

                
                
                <form action="http://localhost/conselhos/login" method="post">
                    <input type="hidden" name="csrf_test_name" value="11ba917cdfaff272fbf9756b982432fc">
                    <!-- Email -->
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="floatingEmailInput" name="email" inputmode="email" autocomplete="email" placeholder="Email Address" value="" required />
                        <label for="floatingEmailInput">Email Address</label>
                    </div>

                    <!-- Password -->
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="floatingPasswordInput" name="password" inputmode="text" autocomplete="current-password" placeholder="Password" required />
                        <label for="floatingPasswordInput">Password</label>
                    </div>

                    <!-- Remember me -->
                                            <div class="form-check">
                            <label class="form-check-label">
                                <input type="checkbox" name="remember" class="form-check-input" >
                                Remember me?                            </label>
                        </div>
                    
                    <div class="d-grid col-12 col-md-8 mx-auto m-3">
                        <button type="submit" class="btn btn-primary btn-block">Login</button>
                    </div>

                                            <p class="text-center">Forgot your password? <a href="http://localhost/conselhos/login/magic-link">Use a Login Link</a></p>
                    
                                            <p class="text-center">Need an account? <a href="http://localhost/conselhos/register">Register</a></p>
                    
                </form>
            </div>
        </div>
    </div>

    </main>

</template>

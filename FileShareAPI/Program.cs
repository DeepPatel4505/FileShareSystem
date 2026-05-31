using FileShareAPI.Data;
using FileShareAPI.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
builder.Services.AddScoped<IFileService, FileService>();

// Build the application - this will create an instance of the web application with the configured services and middleware
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs");
}
app.UseCors("AllowFrontend");

// Middleware - this will redirect HTTP requests to HTTPS
app.UseHttpsRedirection();

// Authorization middleware - this will check if the user is authorized to access the endpoint
app.UseAuthorization();

// Map controllers - mapping the endpoints to the controllers
app.MapControllers();

// Run the application - this will start the web server and listen for incoming HTTP requests
app.Run();

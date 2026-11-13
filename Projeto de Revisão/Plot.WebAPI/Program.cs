using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Plot.WebAPI.Context;
using Plot.WebAPI.Interfaces;
using Plot.WebAPI.Repositories;
using Plot.WebAPI.Services;
using Plot.WebAPI.Utils;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<PlotDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Configure a ConnectionString")));

builder.Services.AddScoped<IGeneroRepository, GeneroRepository>();
builder.Services.AddScoped<IFilmeRepository, FilmeRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection(CloudinarySettings.SectionName));
builder.Services.AddScoped<IImageService, CloudinaryService>();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
options.SwaggerDoc("v1", new OpenApiInfo
{
    Title = "Plot.WebAPI",
    Version = "v1",
    Description = "API de filmes, gênero e usuários."
}));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Plot.WebAPI v1");
        options.RoutePrefix = string.Empty;
    });
    app.MapGet("/swagger", () => Results.Redirect("/"));
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();

using PokeSeekr.API.Services;
using PokeSeekr.Database.models;
using PokeSeekr.Database.repositories;
using PokeSeekr.API.Models;
using PokeSeekr.Database.Repositories;
using PokemonTcgSdk;
using PokemonTcgSdk.Standard.Infrastructure.HttpClients;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddDbContext<PostgresContext>();

// Register PokemonApiClient as a singleton with API key from user secrets
var pokemonTcgApiKey = builder.Configuration["PokemonTcg:ApiKey"];

if (string.IsNullOrEmpty(pokemonTcgApiKey))
{
    throw new InvalidOperationException("Pokemon TCG API key not found in user secrets");
}


builder.Services.AddSingleton<PokemonApiClient>(sp => new PokemonApiClient(pokemonTcgApiKey));

// Add services to the container.
builder.Services.AddScoped<ICalculateService, CalculateService>();
builder.Services.AddScoped<ICardRepo, CardRepo>();
builder.Services.AddScoped<IArtistRepo, ArtistRepo>();
builder.Services.AddScoped<IRarityRepo, RarityRepo>();
builder.Services.AddScoped<ISetRepo, SetRepo>();
builder.Services.AddScoped<ISeekrService, SeekrService>(); 

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new VectorJsonConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS before HTTPS redirection and authorization
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();

using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace PokeSeekr.Database.models;

public partial class PostgresContext : DbContext
{
    private readonly IConfiguration _configuration;

    public PostgresContext()
    {
        var builder = new ConfigurationBuilder()
            .AddUserSecrets<PostgresContext>()
            .Build();
        
        _configuration = builder;
    }

    public PostgresContext(DbContextOptions<PostgresContext> options)
        : base(options)
    {
    }

    public virtual DbSet<PokemonCard> PokemonCards { get; set; }

    public virtual DbSet<Artist> Artists { get; set; }

    public virtual DbSet<Rarity> Rarities { get; set; }
    
    public virtual DbSet<Set> Sets { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            var connectionString = _configuration["DB_CONNECTION_STRING"];

            // Fallback to hardcoded connection string only if not found in user secrets
            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("Connection string not found in user secrets or appsettings.json");
            }
            
            optionsBuilder.UseNpgsql(connectionString, o => o.UseVector());
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresExtension("vector");

        modelBuilder.Entity<PokemonCard>(entity =>
        {
            entity.HasKey(e => e.PokemonCardId).HasName("pokemon_cards_pkey");

            entity.ToTable("pokemon_cards");

            entity.Property(e => e.PokemonCardId).HasColumnName("pokemon_card_id");
            entity.Property(e => e.Artist).HasColumnName("artist");
            entity.Property(e => e.Downloaded)
                .HasDefaultValue(false)
                .HasColumnName("downloaded");
            entity.Property(e => e.EvolvesFrom).HasColumnName("evolves_from");
            entity.Property(e => e.FlavorText).HasColumnName("flavor_text");
            entity.Property(e => e.Hp).HasColumnName("hp");
            entity.Property(e => e.ImageLarge).HasColumnName("image_large");
            entity.Property(e => e.ImageSmall).HasColumnName("image_small");
            entity.Property(e => e.Level).HasColumnName("level");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Number).HasColumnName("number");
            entity.Property(e => e.Rarity).HasColumnName("rarity");
            entity.Property(e => e.Supertype).HasColumnName("supertype");
            entity.Property(e => e.TcgId).HasColumnName("tcg_id");
            entity.Property(e => e.SetId).HasColumnName("set_id");

            entity.HasOne(d => d.Set)
                .WithMany(p => p.PokemonCards)
                .HasForeignKey(d => d.SetId)
                .HasConstraintName("fk_pokemon_cards_sets");
        });

        modelBuilder.Entity<Artist>(entity =>
        {
            entity.HasKey(e => e.ArtistId).HasName("artists_pkey");

            entity.ToTable("artists");

            entity.Property(e => e.ArtistId).HasColumnName("artist_id");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<Rarity>(entity =>
        {
            entity.HasKey(e => e.RarityId).HasName("rarities_pkey");

            entity.ToTable("rarities");

            entity.Property(e => e.RarityId).HasColumnName("rarity_id");
            entity.Property(e => e.Name).HasColumnName("name");

            entity.HasIndex(e => e.Name).IsUnique();
        });
        
        modelBuilder.Entity<Set>(entity =>
        {
            entity.HasKey(e => e.SetId).HasName("sets_pkey");

            entity.ToTable("sets");

            entity.Property(e => e.SetId).HasColumnName("set_id");
            entity.Property(e => e.TcgId).HasColumnName("tcg_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Series).HasColumnName("series");
            entity.Property(e => e.PrintedTotal).HasColumnName("printed_total");
            entity.Property(e => e.Total).HasColumnName("total");
            entity.Property(e => e.ReleaseDate).HasColumnName("release_date");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.SymbolUrl).HasColumnName("symbol_url");

            entity.HasIndex(e => e.TcgId).IsUnique();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

## Getting Started

 ## back
    cd back
    docker compose up --build
    npm run start:dev

## front
    cd front
    npm run dev

## migrations
    npx prisma migrate dev --name <nom_de_la_migration>
    npx prisma studio   # pour démarrer Prisma Studio et vérifier si la base de données est accessible

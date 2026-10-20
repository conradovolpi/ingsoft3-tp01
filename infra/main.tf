terraform {
  required_version = ">= 1.5"

  required_providers {
    neon = {
      source  = "kislerdm/neon"
      version = "0.18.0"
    }
    render = {
      source  = "render-oss/render"
      version = "1.9.1"
    }
  }
}

provider "neon" {}
provider "render" {}

resource "neon_project" "preprod" {
  name                      = "misgastos-preprod"
  org_id                    = "org-bitter-fire-53869980"
  history_retention_seconds = 21600
}

resource "neon_role" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "misgastos_preprod_owner"
}

resource "neon_database" "preprod" {
  project_id = neon_project.preprod.id
  branch_id  = neon_project.preprod.default_branch_id
  name       = "misgastos_preprod"
  owner_name = neon_role.preprod.name
}
locals {
  conn = "Host=${neon_project.preprod.database_host};Database=${neon_database.preprod.name};Username=${neon_role.preprod.name};Password=${neon_role.preprod.password};SSL Mode=Require"
}

resource "render_web_service" "api" {
  name   = "misgastos-api-preprod-volpi"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = var.image_repo_api
      tag       = var.image_tag
    }
  }

  env_vars = {
    DB_PROVIDER = {
      value = "postgres"
    }
    ConnectionStrings__DefaultConnection = {
      value = local.conn
    }
  }
}

resource "render_web_service" "front" {
  name   = "misgastos-front-preprod-volpi"
  plan   = "free"
  region = var.region

  runtime_source = {
    image = {
      image_url = var.image_repo_front
      tag       = var.image_tag
    }
  }

  env_vars = {
    BACKEND_URL = {
      value = trimsuffix(render_web_service.api.url, "/")
    }
    DNS_RESOLVER = {
      value = "8.8.8.8"
    }
  }
}
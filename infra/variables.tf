variable "image_repo_api" {
  type    = string
  default = "ghcr.io/conradovolpi/ingsoft3-tp01-backend"
}

variable "image_repo_front" {
  type    = string
  default = "ghcr.io/conradovolpi/ingsoft3-tp01-frontend"
}

variable "image_tag" {
  type    = string
  default = "sha-700f7a93d3ae4fa6cbf95dfdf1feb8c1e3ac2080"
}

variable "region" {
  type    = string
  default = "oregon"
}
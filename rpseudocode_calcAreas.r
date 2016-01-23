-111-1-110011101221112442001-1101-1-12001-1-1111212234-120012211-1101-1-121111100012211221002-1322101-121111102-13-1-121212-111-121112222-121222112-10011112-112-120133001-1101223-1212-1-100222012-12111-132001-1101-121001110012210112111110001-1321001-123-1200023-1-120012-13-120001-14-120001121100

derp <- "-111-1-110011101221112442001-1101-1-12001-1-1111212234-120012211-1101-1-121111100012211221002-1322101-121111102-13-1-121212-111-121112222-121222112-10011112-112-120133001-1101223-1212-1-100222012-12111-132001-1101-121001110012210112111110001-1321001-123-1200023-1-120012-13-120001-14-120001121100"

derp2 <- gsub("([[:digit:]]{1})([[:digit:]]{1})", "\\1,\\2", derp)
derp3 <- gsub("([[:digit:]]{1})([[:digit:]]{1})", "\\1,\\2", derp2)
derp4 <- gsub("-", ",-", derp3)

derp5 <- unlist(strsplit(derp4, ","))[-1]

derp6 <- matrix(derp5, ncol = 16, byrow = TRUE)

// Starting off with and index of all of the squares with no mines

// First square is by default in area 1
// Set current area to 2
// Starting at the second square
  // If that square is touching any previous squares
    // Touching 1 square, set the area of the new square equal to that
    // Touching multiple squares means that tile is a joining point for multiple regions and the regions with higher integer areas must be assigned to the lower one
      // Set the square to the lowest area designation
      // Set area of squares equal to the higher areas to the lower area
  // If that square is not touching any previous spaces then assign that square the next area designation (previous area + 1)

// At the end you can optionally change the areas all to be consecutive or not

noMineTiles <- which(derp6 > 0)
areas <- list()
areas[[1]] <- noMineTiles[1]
areaInt = 2

xind = matrix(rep(1:16, 16), ncol = 16)
yind = matrix(rep(1:16, 16), ncol = 16, byrow = TRUE)

for (a in 2:length(noMineTiles)) {
  xind[a], yind[a]
}

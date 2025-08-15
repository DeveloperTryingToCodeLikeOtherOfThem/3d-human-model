// Define variables for rotation and position
let centerX = screen.width / 2; // Center X of the screen
let centerY = screen.height / 2; // Center Y of the screen
let size = 35; // Base size of the figure - Increased for better visibility of parts
let angleY = 0; // Rotation around Y-axis
let angleX = 0; // Rotation around X-axis
let angleZ = 0; // Rotation around Z-axis (currently unused, but there for future use)

// Initialize lastTime for FPS calculation
let lastTime = 0;

// Main game update loop
game.onUpdate(function () {
    // Clear the screen with a background color (e.g., light blue for sky)
    scene.backgroundImage().fill(14); // MakeCode palette color 14 is a light blue

    // Update rotation angles based on controller input
    // This allows the user to rotate the 3D model
    if (controller.left.isPressed()) {
        angleY += 0.05; // Rotate left
    }
    if (controller.right.isPressed()) {
        angleY -= 0.05; // Rotate right
    }
    if (controller.up.isPressed()) {
        angleX += 0.05; // Rotate up
    }
    if (controller.down.isPressed()) {
        angleX -= 0.05; // Rotate down
    }

    // --- Define the vertices for a more detailed humanoid model ---
    // Each object represents a point in 3D space (x, y, z coordinates)
    // The comments indicate which part of the body each set of vertices belongs to.
    let vertices = [
        // Head (Cube-like structure) - Indices 0-7
        // Positioned around the origin for easier initial calculations, then shifted for projection
        { x: -size / 4, y: -size / 2, z: -size / 4 }, // 0: Front-top-left
        { x: size / 4, y: -size / 2, z: -size / 4 },  // 1: Front-top-right
        { x: size / 4, y: 0, z: -size / 4 },   // 2: Front-bottom-right
        { x: -size / 4, y: 0, z: -size / 4 },  // 3: Front-bottom-left
        { x: -size / 4, y: -size / 2, z: size / 4 },  // 4: Back-top-left
        { x: size / 4, y: -size / 2, z: size / 4 },   // 5: Back-top-right
        { x: size / 4, y: 0, z: size / 4 },    // 6: Back-bottom-right
        { x: -size / 4, y: 0, z: size / 4 },   // 7: Back-bottom-left

        // Torso (Larger cube/rectangular prism) - Indices 8-15
        // Positioned below the head
        { x: -size / 2, y: 0, z: -size / 4 },  // 8: Front-top-left
        { x: size / 2, y: 0, z: -size / 4 },   // 9: Front-top-right
        { x: size / 2, y: size * 1.5, z: -size / 4 }, // 10: Front-bottom-right (taller body)
        { x: -size / 2, y: size * 1.5, z: -size / 4 },// 11: Front-bottom-left
        { x: -size / 2, y: 0, z: size / 4 },   // 12: Back-top-left
        { x: size / 2, y: 0, z: size / 4 },    // 13: Back-top-right
        { x: size / 2, y: size * 1.5, z: size / 4 },  // 14: Back-bottom-right
        { x: -size / 2, y: size * 1.5, z: size / 4 }, // 15: Back-bottom-left

        // Left Arm (Upper) - Indices 16-23
        // Positioned relative to torso's top-left
        { x: -size / 2 - size / 8, y: 0, z: -size / 8 }, // 16: Front-top-left
        { x: -size / 2 - size / 8 + size / 4, y: 0, z: -size / 8 }, // 17: Front-top-right
        { x: -size / 2 - size / 8 + size / 4, y: size / 2, z: -size / 8 }, // 18: Front-bottom-right
        { x: -size / 2 - size / 8, y: size / 2, z: -size / 8 }, // 19: Front-bottom-left
        { x: -size / 2 - size / 8, y: 0, z: size / 8 }, // 20: Back-top-left
        { x: -size / 2 - size / 8 + size / 4, y: 0, z: size / 8 }, // 21: Back-top-right
        { x: -size / 2 - size / 8 + size / 4, y: size / 2, z: size / 8 }, // 22: Back-bottom-right
        { x: -size / 2 - size / 8, y: size / 2, z: size / 8 }, // 23: Back-bottom-left

        // Right Arm (Upper) - Indices 24-31
        // Positioned relative to torso's top-right
        { x: size / 2 - size / 4 + size / 8, y: 0, z: -size / 8 }, // 24: Front-top-left
        { x: size / 2 + size / 8, y: 0, z: -size / 8 }, // 25: Front-top-right
        { x: size / 2 + size / 8, y: size / 2, z: -size / 8 }, // 26: Front-bottom-right
        { x: size / 2 - size / 4 + size / 8, y: size / 2, z: -size / 8 }, // 27: Front-bottom-left
        { x: size / 2 - size / 4 + size / 8, y: 0, z: size / 8 }, // 28: Back-top-left
        { x: size / 2 + size / 8, y: 0, z: size / 8 }, // 29: Back-top-right
        { x: size / 2 + size / 8, y: size / 2, z: size / 8 }, // 30: Back-bottom-right
        { x: size / 2 - size / 4 + size / 8, y: size / 2, z: size / 8 }, // 31: Back-bottom-left

        // Left Leg (Upper) - Indices 32-39
        // Positioned below the torso
        { x: -size / 4, y: size * 1.5, z: -size / 8 }, // 32: Front-top-left
        { x: -size / 4 + size / 2, y: size * 1.5, z: -size / 8 }, // 33: Front-top-right
        { x: -size / 4 + size / 2, y: size * 1.5 + size, z: -size / 8 }, // 34: Front-bottom-right
        { x: -size / 4, y: size * 1.5 + size, z: -size / 8 }, // 35: Front-bottom-left
        { x: -size / 4, y: size * 1.5, z: size / 8 }, // 36: Back-top-left
        { x: -size / 4 + size / 2, y: size * 1.5, z: size / 8 }, // 37: Back-top-right
        { x: -size / 4 + size / 2, y: size * 1.5 + size, z: size / 8 }, // 38: Back-bottom-right
        { x: -size / 4, y: size * 1.5 + size, z: size / 8 }, // 39: Back-bottom-left

        // Right Leg (Upper) - Indices 40-47
        // Positioned below the torso
        { x: size / 4 - size / 2, y: size * 1.5, z: -size / 8 }, // 40: Front-top-left
        { x: size / 4, y: size * 1.5, z: -size / 8 }, // 41: Front-top-right
        { x: size / 4, y: size * 1.5 + size, z: -size / 8 }, // 42: Front-bottom-right
        { x: size / 4 - size / 2, y: size * 1.5 + size, z: -size / 8 }, // 43: Front-bottom-left
        { x: size / 4 - size / 2, y: size * 1.5, z: size / 8 }, // 44: Back-top-left
        { x: size / 4, y: size * 1.5, z: size / 8 }, // 45: Back-top-right
        { x: size / 4, y: size * 1.5 + size, z: size / 8 }, // 46: Back-bottom-right
        { x: size / 4 - size / 2, y: size * 1.5 + size, z: size / 8 }, // 47: Back-bottom-left
    ];

    // --- Transform vertices based on rotation and projection ---
    // This part applies 3D rotations and then projects the 3D points
    // onto a 2D plane (your screen) to create the illusion of depth.
    let rotatedVertices = vertices.map(vertex => {
        let x = vertex.x;
        let y = vertex.y;
        let z = vertex.z;

        // Apply Y-axis rotation (for left/right turns)
        let cosY = Math.cos(angleY);
        let sinY = Math.sin(angleY);
        let rotatedX = x * cosY + z * sinY;
        let rotatedZ = -x * sinY + z * cosY; // Z-coordinate after Y-rotation

        // Apply X-axis rotation (for up/down turns)
        let cosX = Math.cos(angleX);
        let sinX = Math.sin(angleX);
        let finalY = y * cosX - rotatedZ * sinX;
        rotatedZ = y * sinX + rotatedZ * cosX; // Z-coordinate after X-rotation

        // Project onto 2D screen using perspective projection
        // The '200' here is an arbitrary focal length for the "camera"
        let scaleFactor = 200 / (200 + rotatedZ);
        let projectedX = rotatedX * scaleFactor;
        let projectedY = finalY * scaleFactor; // Use finalY here

        // Translate to screen coordinates, adjusting for center
        return { x: centerX + projectedX, y: centerY + projectedY, z: rotatedZ };
    });

    // --- Define the triangles and their colors for each part of the body ---
    // Each entry connects 3 vertex indices to form a triangle and assigns it a color.
    let triangles = [
        // Head (Skin color: 12 - a light color)
        // Front face: 0,1,2,3
        { indices: [0, 1, 2], color: 12 }, { indices: [0, 2, 3], color: 12 },
        // Back face: 4,5,6,7
        { indices: [4, 5, 6], color: 12 }, { indices: [4, 6, 7], color: 12 },
        // Right face: 1,5,6,2
        { indices: [1, 5, 6], color: 12 }, { indices: [1, 6, 2], color: 12 },
        // Left face: 0,3,7,4
        { indices: [0, 3, 7], color: 12 }, { indices: [0, 7, 4], color: 12 },
        // Top face: 0,4,5,1
        { indices: [0, 4, 5], color: 12 }, { indices: [0, 5, 1], color: 12 },
        // Bottom face: 3,2,6,7
        { indices: [3, 2, 6], color: 12 }, { indices: [3, 6, 7], color: 12 },


        // Torso (Clothing color: 9 - a darker color)
        // Front face: 8,9,10,11
        { indices: [8, 9, 10], color: 9 }, { indices: [8, 10, 11], color: 9 },
        // Back face: 12,13,14,15
        { indices: [12, 13, 14], color: 9 }, { indices: [12, 14, 15], color: 9 },
        // Right face: 9,13,14,10
        { indices: [9, 13, 14], color: 9 }, { indices: [9, 14, 10], color: 9 },
        // Left face: 8,11,15,12
        { indices: [8, 11, 15], color: 9 }, { indices: [8, 15, 12], color: 9 },
        // Top face: 8,12,13,9
        { indices: [8, 12, 13], color: 9 }, { indices: [8, 13, 9], color: 9 },
        // Bottom face: 11,10,14,15
        { indices: [11, 10, 14], color: 9 }, { indices: [11, 14, 15], color: 9 },

        // Left Arm (Upper) - Color: 7
        // Front face: 16,17,18,19
        { indices: [16, 17, 18], color: 7 }, { indices: [16, 18, 19], color: 7 },
        // Back face: 20,21,22,23
        { indices: [20, 21, 22], color: 7 }, { indices: [20, 22, 23], color: 7 },
        // Right face: 17,21,22,18
        { indices: [17, 21, 22], color: 7 }, { indices: [17, 22, 18], color: 7 },
        // Left face: 16,19,23,20
        { indices: [16, 19, 23], color: 7 }, { indices: [16, 23, 20], color: 7 },
        // Top face: 16,20,21,17
        { indices: [16, 20, 21], color: 7 }, { indices: [16, 21, 17], color: 7 },
        // Bottom face: 19,18,22,23
        { indices: [19, 18, 22], color: 7 }, { indices: [19, 22, 23], color: 7 },

        // Right Arm (Upper) - Color: 7
        // Front face: 24,25,26,27
        { indices: [24, 25, 26], color: 7 }, { indices: [24, 26, 27], color: 7 },
        // Back face: 28,29,30,31
        { indices: [28, 29, 30], color: 7 }, { indices: [28, 30, 31], color: 7 },
        // Right face: 25,29,30,26
        { indices: [25, 29, 30], color: 7 }, { indices: [25, 30, 26], color: 7 },
        // Left face: 24,27,31,28
        { indices: [24, 27, 31], color: 7 }, { indices: [24, 31, 28], color: 7 },
        // Top face: 24,28,29,25
        { indices: [24, 28, 29], color: 7 }, { indices: [24, 29, 25], color: 7 },
        // Bottom face: 27,26,30,31
        { indices: [27, 26, 30], color: 7 }, { indices: [27, 30, 31], color: 7 },

        // Left Leg (Upper) - Color: 6 (e.g., for pants)
        // Front face: 32,33,34,35
        { indices: [32, 33, 34], color: 6 }, { indices: [32, 34, 35], color: 6 },
        // Back face: 36,37,38,39
        { indices: [36, 37, 38], color: 6 }, { indices: [36, 38, 39], color: 6 },
        // Right face: 33,37,38,34
        { indices: [33, 37, 38], color: 6 }, { indices: [33, 38, 34], color: 6 },
        // Left face: 32,35,39,36
        { indices: [32, 35, 39], color: 6 }, { indices: [32, 39, 36], color: 6 },
        // Top face: 32,36,37,33
        { indices: [32, 36, 37], color: 6 }, { indices: [32, 37, 33], color: 6 },
        // Bottom face: 35,34,38,39
        { indices: [35, 34, 38], color: 6 }, { indices: [35, 38, 39], color: 6 },

        // Right Leg (Upper) - Color: 6
        // Front face: 40,41,42,43
        { indices: [40, 41, 42], color: 6 }, { indices: [40, 42, 43], color: 6 },
        // Back face: 44,45,46,47
        { indices: [44, 45, 46], color: 6 }, { indices: [44, 46, 47], color: 6 },
        // Right face: 41,45,46,42
        { indices: [41, 45, 46], color: 6 }, { indices: [41, 46, 42], color: 6 },
        // Left face: 40,43,47,44
        { indices: [40, 43, 47], color: 6 }, { indices: [40, 47, 44], color: 6 },
        // Top face: 40,44,45,41
        { indices: [40, 44, 45], color: 6 }, { indices: [40, 45, 41], color: 6 },
        // Bottom face: 43,42,46,47
        { indices: [43, 42, 46], color: 6 }, { indices: [43, 46, 47], color: 6 },
    ];

    // Sort triangles based on their average Z-coordinate for correct drawing order
    // This ensures that triangles farther away are drawn before closer ones, preventing visual glitches.
    triangles.sort((b, a) => {
        let zA = (rotatedVertices[a.indices[0]].z + rotatedVertices[a.indices[1]].z + rotatedVertices[a.indices[2]].z) / 3;
        let zB = (rotatedVertices[b.indices[0]].z + rotatedVertices[b.indices[1]].z + rotatedVertices[b.indices[2]].z) / 3;
        return zA - zB;
    });

    // Calculate and display FPS (frames per second) for performance monitoring
    let currentTime = game.runtime();
    let deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    let fps = Math.floor(1000 / deltaTime);
    // You can see the FPS in the MakeCode simulator's debug overlay.
    // stats.setStat("FPS: " + fps.toString());

    // Draw all the sorted triangles onto the background image
    for (let i = 0; i < triangles.length; i++) {
        let triangle = triangles[i];
        let indices = triangle.indices;
        let color = triangle.color;

        // Use fillTriangle to draw a solid, colored triangle
        scene.backgroundImage().fillTriangle(
            rotatedVertices[indices[0]].x, rotatedVertices[indices[0]].y,
            rotatedVertices[indices[1]].x, rotatedVertices[indices[1]].y,
            rotatedVertices[indices[2]].x, rotatedVertices[indices[2]].y,
            color
        );
    }
});
